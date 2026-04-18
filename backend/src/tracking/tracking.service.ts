import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveLocationDto } from './dto/save-location.dto';
import { TrackingLocation } from './entities/tracking-location.entity';

@Injectable()
export class TrackingService {
  private lastSavedAt = new Map<string, number>();

  constructor(
    @InjectRepository(TrackingLocation)
    private readonly locationRepo: Repository<TrackingLocation>,
  ) {}

  async saveLocation(dto: SaveLocationDto): Promise<void> {
    const now = Date.now();
    const last = this.lastSavedAt.get(dto.livreurId) ?? 0;
    if (now - last >= 10_000) {
      const loc = this.locationRepo.create({
        livreurId: dto.livreurId,
        lat: dto.lat,
        lng: dto.lng,
        speed: dto.speed,
        heading: dto.heading,
      });
      await this.locationRepo.save(loc);
      this.lastSavedAt.set(dto.livreurId, now);
    }
  }

  async getLastLocation(livreurId: string): Promise<TrackingLocation | null> {
    return this.locationRepo.findOne({
      where: { livreurId },
      order: { createdAt: 'DESC' },
    });
  }
}
