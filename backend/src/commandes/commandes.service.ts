import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { DataSource, Repository } from 'typeorm';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Agency } from '../users/entities/agency.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { WalletService } from '../wallet/wallet.service';
import { RevenuPlateforme } from '../wallet/entities/revenu-plateforme.entity';
import { ConfirmDeliveryDto } from './dto/confirm-delivery.dto';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { RateCommandeDto } from './dto/rate-commande.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Commande } from './entities/commande.entity';

@Injectable()
export class CommandesService {
  private redis: Redis;
  private selectionTimers = new Map<number, NodeJS.Timeout>();
  private selectionIntervals = new Map<number, NodeJS.Timeout>();

  constructor(
    @InjectRepository(Commande)
    private readonly commandeRepo: Repository<Commande>,
    @InjectRepository(Agency)
    private readonly agenceRepo: Repository<Agency>,
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
    @InjectRepository(RevenuPlateforme)
    private readonly revenuRepo: Repository<RevenuPlateforme>,
    private readonly walletService: WalletService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly dataSource: DataSource,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  private generateNumero(): string {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `CMD-${num}`;
  }

  private generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async create(agenceUserId: number, dto: CreateCommandeDto): Promise<Commande> {
    const agence = await this.agenceRepo.findOne({
      where: { id: agenceUserId },
    });
    if (!agence) throw new NotFoundException('Agence not found');

    await this.walletService.blockAmount(
      agenceUserId,
      dto.price,
      `Blocage pour commande`,
    );

    let numero = this.generateNumero();
    let exists = await this.commandeRepo.findOne({ where: { numero } });
    while (exists) {
      numero = this.generateNumero();
      exists = await this.commandeRepo.findOne({ where: { numero } });
    }

    const commande = this.commandeRepo.create({
      ...dto,
      numero,
      status: 'en_attente',
      agence,
      livreur: null,
    });
    return this.commandeRepo.save(commande);
  }

  async findAvailable(): Promise<Commande[]> {
    return this.commandeRepo.find({
      where: { status: 'en_attente' },
      relations: ['agence'],
      order: { isUrgent: 'DESC', createdAt: 'ASC' },
    });
  }

  async findByAgence(agenceUserId: number): Promise<Commande[]> {
    return this.commandeRepo.find({
      where: { agence: { id: agenceUserId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Commande> {
    const commande = await this.commandeRepo.findOne({
      where: { id },
      relations: ['agence', 'livreur'],
    });
    if (!commande) throw new NotFoundException('Commande not found');
    return commande;
  }

  async findMyApplications(livreurId: number): Promise<Commande[]> {
    const key = `livreur_applications:${livreurId}`;
    const commandeIds = await this.redis.lrange(key, 0, -1);
    if (!commandeIds.length) return [];

    const ids = commandeIds.map(Number).filter(Boolean);
    const commandes = await Promise.all(
      ids.map((id) =>
        this.commandeRepo.findOne({ where: { id }, relations: ['agence'] }),
      ),
    );
    return commandes.filter(Boolean) as Commande[];
  }

  async getApplications(commandeId: number) {
    const key = `applications:${commandeId}`;
    const results = await this.redis.zrangebyscore(key, '-inf', '+inf', 'WITHSCORES');

    const applications: Array<{ livreur: Delivery; score: number }> = [];
    for (let i = 0; i < results.length; i += 2) {
      const livreurId = parseInt(results[i]);
      const score = parseFloat(results[i + 1]);
      const livreur = await this.deliveryRepo.findOne({ where: { id: livreurId } });
      if (livreur) {
        applications.push({ livreur, score });
      }
    }
    return applications.sort((a, b) => b.score - a.score);
  }

  async apply(commandeId: number, livreurUserId: number) {
    const commande = await this.findOne(commandeId);
    if (commande.status !== 'en_attente') {
      throw new BadRequestException('Cette commande n\'est plus disponible');
    }

    const livreur = await this.deliveryRepo.findOne({
      where: { id: livreurUserId },
    });
    if (!livreur) throw new NotFoundException('Livreur not found');
    if (!livreur.isVerified) {
      throw new ForbiddenException('Votre compte n\'est pas encore vérifié');
    }
    if (livreur.status !== 'online') {
      throw new ForbiddenException('Vous devez être en ligne pour postuler');
    }

    const appKey = `applications:${commandeId}`;
    const livreurKey = `livreur_applications:${livreurUserId}`;

    const score = Number(livreur.averageNote) || 0;
    await this.redis.zadd(appKey, score, livreurUserId.toString());
    await this.redis.rpush(livreurKey, commandeId.toString());

    const count = await this.redis.zcard(appKey);
    if (count === 1) {
      this.startSelectionTimer(commandeId, commande.agence.id);
    }

    this.notificationsGateway.emitToAgency(commande.agence.id, 'new.application', {
      commandeId,
      livreur: {
        id: livreur.id,
        username: livreur.username,
        averageNote: livreur.averageNote,
        vehicleType: livreur.vehicleType,
      },
    });

    return { message: 'Candidature envoyée' };
  }

  private startSelectionTimer(commandeId: number, agenceId: number) {
    let secondsLeft = 120;

    const interval = setInterval(() => {
      secondsLeft -= 1;
      this.notificationsGateway.emitToAgency(agenceId, 'selection.timer', {
        commandeId,
        secondsLeft,
      });
    }, 1000);

    const timeout = setTimeout(async () => {
      clearInterval(interval);
      this.selectionTimers.delete(commandeId);
      this.selectionIntervals.delete(commandeId);
      await this.autoSelect(commandeId);
    }, 120_000);

    this.selectionTimers.set(commandeId, timeout);
    this.selectionIntervals.set(commandeId, interval);
  }

  private cancelSelectionTimer(commandeId: number) {
    const timeout = this.selectionTimers.get(commandeId);
    const interval = this.selectionIntervals.get(commandeId);
    if (timeout) {
      clearTimeout(timeout);
      this.selectionTimers.delete(commandeId);
    }
    if (interval) {
      clearInterval(interval);
      this.selectionIntervals.delete(commandeId);
    }
  }

  private async autoSelect(commandeId: number) {
    const key = `applications:${commandeId}`;
    const best = await this.redis.zrevrange(key, 0, 0);
    if (!best.length) return;

    const livreurId = parseInt(best[0]);
    try {
      await this.selectLivreur(commandeId, livreurId);
    } catch {
      // Commande may have been cancelled or already assigned
    }
  }

  async selectLivreur(commandeId: number, livreurId: number) {
    const commande = await this.findOne(commandeId);
    if (commande.status !== 'en_attente') {
      throw new BadRequestException('Cette commande n\'est plus disponible');
    }

    const livreur = await this.deliveryRepo.findOne({ where: { id: livreurId } });
    if (!livreur) throw new NotFoundException('Livreur not found');

    this.cancelSelectionTimer(commandeId);

    commande.status = 'en_cours_pickup';
    commande.livreur = livreur;
    await this.commandeRepo.save(commande);

    const appKey = `applications:${commandeId}`;
    const livreurKey = `livreur_applications:${livreurId}`;
    const otherCommandeIds = await this.redis.lrange(livreurKey, 0, -1);

    for (const otherId of otherCommandeIds) {
      if (otherId !== commandeId.toString()) {
        await this.redis.zrem(`applications:${otherId}`, livreurId.toString());
      }
    }

    await this.redis.del(appKey);
    await this.redis.del(livreurKey);

    this.notificationsGateway.emitToLivreur(livreurId, 'commande.assigned', {
      commande,
    });

    this.notificationsGateway.emitToAgency(commande.agence.id, 'commande.status.changed', {
      commandeId,
      status: 'en_cours_pickup',
    });

    return commande;
  }

  async updateStatus(commandeId: number, livreurUserId: number, dto: UpdateStatusDto) {
    const commande = await this.findOne(commandeId);

    if (!commande.livreur || commande.livreur.id !== livreurUserId) {
      throw new ForbiddenException('Vous n\'êtes pas assigné à cette commande');
    }

    if (dto.status === 'colis_recupere') {
      const otp = this.generateOtp();
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      commande.otpCode = otp;
      commande.otpExpiresAt = expires;
      // In production: send SMS via SMS_API_KEY
      console.log(`OTP for commande ${commandeId}: ${otp}`);
    }

    commande.status = dto.status as import('./entities/commande.entity').CommandeStatus;
    await this.commandeRepo.save(commande);

    this.notificationsGateway.emitToAgency(commande.agence.id, 'commande.status.changed', {
      commandeId,
      status: dto.status,
      commande,
    });

    return commande;
  }

  async uploadPickupImage(commandeId: number, livreurUserId: number, imageUrl: string) {
    const commande = await this.findOne(commandeId);
    if (!commande.livreur || commande.livreur.id !== livreurUserId) {
      throw new ForbiddenException('Non autorisé');
    }
    commande.pickupImageUrl = imageUrl;
    await this.commandeRepo.save(commande);
    return { pickupImageUrl: imageUrl };
  }

  async uploadDeliveryImage(commandeId: number, livreurUserId: number, imageUrl: string) {
    const commande = await this.findOne(commandeId);
    if (!commande.livreur || commande.livreur.id !== livreurUserId) {
      throw new ForbiddenException('Non autorisé');
    }
    commande.deliveryImageUrl = imageUrl;
    await this.commandeRepo.save(commande);
    return { deliveryImageUrl: imageUrl };
  }

  async confirmDelivery(commandeId: number, livreurUserId: number, dto: ConfirmDeliveryDto) {
    const commande = await this.findOne(commandeId);

    if (!commande.livreur || commande.livreur.id !== livreurUserId) {
      throw new ForbiddenException('Non autorisé');
    }
    if (commande.status !== 'colis_recupere') {
      throw new BadRequestException('Statut invalide pour cette opération');
    }

    if (!commande.otpCode || !commande.otpExpiresAt) {
      throw new BadRequestException('OTP non généré');
    }

    const now = new Date();
    if (now > commande.otpExpiresAt) {
      const newOtp = this.generateOtp();
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      commande.otpCode = newOtp;
      commande.otpExpiresAt = expires;
      await this.commandeRepo.save(commande);
      throw new BadRequestException('Code expiré, un nouveau code a été envoyé');
    }

    if (dto.otpCode !== commande.otpCode) {
      throw new BadRequestException('Code incorrect');
    }

    const price = Number(commande.price);
    const { livreurAmount, commission } = await this.walletService.settleDelivery(
      commande.agence.id,
      commande.livreur.id,
      price,
      commandeId,
    );

    const revenu = this.revenuRepo.create({
      commande,
      montant_total: price,
      montant_livreur: livreurAmount,
      commission,
    });
    await this.revenuRepo.save(revenu);

    commande.status = 'livree';
    commande.otpCode = null;
    await this.commandeRepo.save(commande);

    this.notificationsGateway.emitToAgency(commande.agence.id, 'commande.status.changed', {
      commandeId,
      status: 'livree',
    });

    return { message: 'Livraison confirmée', commande };
  }

  async rateCommande(commandeId: number, agenceUserId: number, dto: RateCommandeDto) {
    const commande = await this.findOne(commandeId);

    if (commande.agence.id !== agenceUserId) {
      throw new ForbiddenException('Non autorisé');
    }
    if (commande.status !== 'livree') {
      throw new BadRequestException('Vous ne pouvez noter qu\'une commande livrée');
    }
    if (!commande.livreur) throw new BadRequestException('Pas de livreur associé');

    const livreur = commande.livreur;
    const allDelivered = await this.commandeRepo.find({
      where: { livreur: { id: livreur.id }, status: 'livree' },
    });

    const newNote =
      (Number(livreur.averageNote) * (allDelivered.length - 1) + dto.stars) /
      allDelivered.length;
    livreur.averageNote = newNote;
    await this.deliveryRepo.save(livreur);

    return { message: 'Note enregistrée', averageNote: newNote };
  }

  async cancel(commandeId: number, agenceUserId: number) {
    const commande = await this.findOne(commandeId);

    if (commande.agence.id !== agenceUserId) {
      throw new ForbiddenException('Non autorisé');
    }

    if (!['en_attente', 'en_cours_pickup'].includes(commande.status)) {
      throw new BadRequestException('Impossible d\'annuler cette commande');
    }

    await this.walletService.unblockAmount(
      agenceUserId,
      Number(commande.price),
      `Annulation commande ${commande.numero}`,
    );

    this.cancelSelectionTimer(commandeId);

    const appKey = `applications:${commandeId}`;
    await this.redis.del(appKey);

    commande.status = 'annulee';
    await this.commandeRepo.save(commande);

    return { message: 'Commande annulée' };
  }
}
