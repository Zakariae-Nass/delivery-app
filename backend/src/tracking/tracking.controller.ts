import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrackingService } from './tracking.service';

@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('last/:livreurId')
  getLastLocation(@Param('livreurId') livreurId: string) {
    return this.trackingService.getLastLocation(livreurId);
  }
}
