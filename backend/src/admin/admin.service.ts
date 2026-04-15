import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { DocStatus, DocVerification } from '../users/entities/doc-verification.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { VerifyDocumentsDto } from '../delivery/dto/verify-documents.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(DocVerification)
    private readonly docRepository: Repository<DocVerification>,
  ) {}

  async getAllDeliveries(page = 1, limit = 10) {
    const [deliveries, total] = await this.deliveryRepository.findAndCount({
      relations: ['location', 'docVerification'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const data = deliveries.map((d) => {
      const { password: _pw, ...rest } = d as Delivery & { password: string };
      const { profileCompleteness } = calculateProfileCompleteness(d);
      return {
        ...rest,
        profileCompleteness,
        docStatus: d.docVerification?.status ?? 'not_uploaded',
      };
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getDeliveryById(id: number) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['location', 'docVerification'],
    });

    if (!delivery) throw new NotFoundException('Delivery user not found');

    const { password: _pw, ...rest } = delivery as Delivery & {
      password: string;
    };
    const completeness = calculateProfileCompleteness(delivery);

    return { ...rest, ...completeness };
  }

  async verifyDocuments(deliveryId: number, dto: VerifyDocumentsDto) {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['location', 'docVerification'],
    });

    if (!delivery) throw new NotFoundException('Delivery user not found');
    if (!delivery.docVerification) {
      throw new NotFoundException('No documents found for this user');
    }

    await this.docRepository.update(delivery.docVerification.id, {
      status: dto.status as DocStatus,
      verifiedAt: new Date(),
    });

    const updated = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ['location', 'docVerification'],
    });

    const { password: _pw, ...updatedUser } = updated as Delivery & {
      password: string;
    };

    return {
      message: `Documents ${dto.status} successfully`,
      reason: dto.reason ?? null,
      updatedUser,
    };
  }
}
