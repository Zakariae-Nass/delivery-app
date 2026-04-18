import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async getOrCreateWallet(userId: number): Promise<Wallet> {
  let wallet = await this.walletRepo.findOne({
    where: { user: { id: userId } },
  });

  if (wallet) return wallet;

  try {
    wallet = this.walletRepo.create({
      user: { id: userId } as User,
      solde: 0,
      solde_bloque: 0,
    });

    wallet = await this.walletRepo.save(wallet);
    return wallet;
  } catch (e) {
    if (e?.code === '23505') {
      const existing = await this.walletRepo.findOne({
        where: { user: { id: userId } },
      });

      if (!existing) {
        throw new Error('Wallet should exist but was not found');
      }

      return existing; // ✅ garanti non-null
    }

    throw e;
  }
}

  private async lockWalletByUserId(
    manager: EntityManager,
    userId: number,
  ): Promise<Wallet | null> {
    // Use query builder to lock only the wallets table, avoiding LEFT JOIN
    // which causes "FOR UPDATE cannot be applied to the nullable side of an outer join"
    return manager
      .createQueryBuilder(Wallet, 'wallet')
      .where('wallet.userId = :userId', { userId })
      .setLock('pessimistic_write')
      .getOne();
  }

  async getWallet(userId: number) {
    return this.getOrCreateWallet(userId);
  }

  async getTransactions(userId: number) {
    const wallet = await this.getOrCreateWallet(userId);
    return this.transactionRepo.find({
      where: { wallet: { id: wallet.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async deposit(userId: number, amount: number) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }
    const wallet = await this.getOrCreateWallet(userId);
    wallet.solde = Number(wallet.solde) + amount;
    await this.walletRepo.save(wallet);

    const tx = this.transactionRepo.create({
      wallet,
      type: 'credit',
      montant: amount,
      description: 'Rechargement du solde',
    });
    await this.transactionRepo.save(tx);

    return { message: 'Solde rechargé avec succès', solde: wallet.solde };
  }

  async withdraw(userId: number, dto: WithdrawDto) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.lockWalletByUserId(manager, userId);
      if (!wallet) throw new NotFoundException('Wallet not found');

      const available = Number(wallet.solde);
      if (dto.montant <= 0) {
        throw new BadRequestException('Le montant doit être supérieur à 0');
      }
      if (dto.montant > available) {
        throw new BadRequestException('Solde insuffisant');
      }

      wallet.solde = available - dto.montant;
      await manager.save(wallet);

      const tx = manager.create(Transaction, {
        wallet,
        type: 'debit',
        montant: dto.montant,
        description: 'Retrait demandé',
      });
      await manager.save(tx);

      return { message: 'Retrait demandé avec succès', solde: wallet.solde };
    });
  }

  async blockAmount(userId: number, amount: number, description: string) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.lockWalletByUserId(manager, userId);
      if (!wallet) throw new NotFoundException('Wallet not found');

      const available = Number(wallet.solde);
      if (amount > available) {
        throw new BadRequestException('Solde insuffisant pour créer la commande');
      }

      wallet.solde = available - amount;
      wallet.solde_bloque = Number(wallet.solde_bloque) + amount;
      await manager.save(wallet);

      const tx = manager.create(Transaction, {
        wallet,
        type: 'blocage',
        montant: amount,
        description,
      });
      await manager.save(tx);
    });
  }

  async unblockAmount(userId: number, amount: number, description: string) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.lockWalletByUserId(manager, userId);
      if (!wallet) throw new NotFoundException('Wallet not found');

      wallet.solde_bloque = Math.max(0, Number(wallet.solde_bloque) - amount);
      wallet.solde = Number(wallet.solde) + amount;
      await manager.save(wallet);

      const tx = manager.create(Transaction, {
        wallet,
        type: 'deblocage',
        montant: amount,
        description,
      });
      await manager.save(tx);
    });
  }

  async settleDelivery(
    agenceUserId: number,
    livreurUserId: number,
    amount: number,
    commandeId: number,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const agenceWallet = await this.lockWalletByUserId(manager, agenceUserId);
      const livreurWallet = await this.lockWalletByUserId(manager, livreurUserId);

      if (!agenceWallet) throw new NotFoundException('Agence wallet not found');
      if (!livreurWallet) throw new NotFoundException('Livreur wallet not found');

      agenceWallet.solde_bloque = Math.max(
        0,
        Number(agenceWallet.solde_bloque) - amount,
      );
      await manager.save(agenceWallet);

      const livreurAmount = amount * 0.85;
      const commission = amount * 0.15;

      livreurWallet.solde = Number(livreurWallet.solde) + livreurAmount;
      await manager.save(livreurWallet);

      const agenceTx = manager.create(Transaction, {
        wallet: agenceWallet,
        type: 'debit',
        montant: amount,
        description: `Livraison commande #${commandeId}`,
      });
      await manager.save(agenceTx);

      const livreurTx = manager.create(Transaction, {
        wallet: livreurWallet,
        type: 'credit',
        montant: livreurAmount,
        description: `Paiement livraison commande #${commandeId}`,
      });
      await manager.save(livreurTx);

      return { livreurAmount, commission };
    });
  }
}
