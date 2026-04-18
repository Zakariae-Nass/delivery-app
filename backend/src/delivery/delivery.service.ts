import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { DocStatus, DocVerification } from '../users/entities/doc-verification.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { UpdateDeliveryProfileDto } from './dto/update-delivery-profile.dto';
import { UploadDocumentsDto } from './dto/upload-documents.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(DocVerification)
    private readonly docRepository: Repository<DocVerification>,
  ) {}

  private async getFullDelivery(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: ['location', 'docVerification'],
    });
    if (!delivery) throw new NotFoundException('Delivery user not found');
    return delivery;
  }

  async updateProfile(userId: number, dto: UpdateDeliveryProfileDto) {
    const delivery = await this.getFullDelivery(userId);

    if (dto.rate !== undefined) delivery.rate = dto.rate;
    if (dto.vehicleType !== undefined) delivery.vehicleType = dto.vehicleType;

    const saved = await this.deliveryRepository.save(delivery);
    const { profileCompleteness } = calculateProfileCompleteness(saved);

    const { password: _pw, ...profile } = saved as Delivery & {
      password: string;
    };

    return {
      message: 'Profile updated successfully',
      profile,
      newCompleteness: profileCompleteness,
    };
  }

  async uploadDocuments(
    userId: number,
    dto: UploadDocumentsDto,
    files: {
      cinImage?: Express.Multer.File[];
      licenceImage?: Express.Multer.File[];
    },
  ) {
    if (!files.cinImage?.[0] || !files.licenceImage?.[0]) {
      throw new BadRequestException(
        'Both cinImage and licenceImage files are required',
      );
    }

    const delivery = await this.getFullDelivery(userId);

    const cinImagePath = files.cinImage[0].path;
    const licenceImagePath = files.licenceImage[0].path;

    if (delivery.docVerification) {
      await this.docRepository.update(delivery.docVerification.id, {
        cin: dto.cin,
        cinImage: cinImagePath,
        licence: dto.licence,
        licenceImage: licenceImagePath,
        status: DocStatus.PENDING,
        uploadedAt: new Date(),
        verifiedAt: null,
      });
    } else {
      const doc = this.docRepository.create({
        cin: dto.cin,
        cinImage: cinImagePath,
        licence: dto.licence,
        licenceImage: licenceImagePath,
        uploadedAt: new Date(),
      });
      const savedDoc = await this.docRepository.save(doc);
      delivery.docVerification = savedDoc;
      await this.deliveryRepository.save(delivery);
    }

    const updated = await this.getFullDelivery(userId);
    const { profileCompleteness } = calculateProfileCompleteness(updated);

    return {
      message: 'Documents uploaded successfully',
      status: 'pending',
      newCompleteness: profileCompleteness,
    };
  }

  async getDocuments(userId: number) {
    const delivery = await this.getFullDelivery(userId);

    if (!delivery.docVerification) {
      return { status: 'not_uploaded', documents: null };
    }

    const { status, cin, licence, cinImage, licenceImage, uploadedAt, verifiedAt } =
      delivery.docVerification;

    return {
      status,
      documents: { cin, licence, cinImage, licenceImage },
      uploadedAt,
      verifiedAt,
    };
  }

  async getDashboard(userId: number) {
    const delivery = await this.getFullDelivery(userId);
    const completeness = calculateProfileCompleteness(delivery);

    const docsApproved = delivery.docVerification?.status === 'approved';
    const readyToDeliver = completeness.profileComplete && docsApproved;

    return {
      profileCompleteness: completeness.profileCompleteness,
      profileComplete: completeness.profileComplete,
      documentsStatus: delivery.docVerification?.status ?? 'not_uploaded',
      readyToAcceptDeliveries: readyToDeliver,
      warnings: completeness.warnings,
      missingFields: completeness.missingFields,
    };
  }

  async getProfile(userId: number) {
    const delivery = await this.getFullDelivery(userId);
    const { password: _pw, ...profile } = delivery as Delivery & { password: string };
    return profile;
  }

  async updateLivreurProfile(userId: number, dto: { username?: string; phone?: string; vehicleType?: string }) {
    const delivery = await this.getFullDelivery(userId);
    if (dto.username !== undefined) delivery.username = dto.username;
    if (dto.phone !== undefined) delivery.phone = dto.phone;
    if (dto.vehicleType !== undefined) delivery.vehicleType = dto.vehicleType;
    const saved = await this.deliveryRepository.save(delivery);
    const { password: _pw, ...profile } = saved as Delivery & { password: string };
    return { message: 'Profil mis à jour', profile };
  }

  async updateStatus(userId: number, status: 'online' | 'offline') {
    const delivery = await this.getFullDelivery(userId);
    if (!delivery.isVerified && status === 'online') {
      throw new BadRequestException('Votre compte n\'est pas encore vérifié');
    }
    delivery.status = status;
    await this.deliveryRepository.save(delivery);
    return { status };
  }

  async updatePhoto(userId: number, photoUrl: string) {
    const delivery = await this.getFullDelivery(userId);
    delivery.photoUrl = photoUrl;
    await this.deliveryRepository.save(delivery);
    return { photoUrl };
  }

  async updateKyc(userId: number, kycDocumentUrl: string) {
    const delivery = await this.getFullDelivery(userId);
    delivery.kycDocumentUrl = kycDocumentUrl;
    await this.deliveryRepository.save(delivery);
    return { kycDocumentUrl, kycStatus: 'pending' };
  }
}
