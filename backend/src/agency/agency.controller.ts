import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AgencyService } from './agency.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('agency')
@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get('dashboard')
  getDashboard(@GetUser() user: { userId: number }) {
    return this.agencyService.getDashboard(user.userId);
  }
}
