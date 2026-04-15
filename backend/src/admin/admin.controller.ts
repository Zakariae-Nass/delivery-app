import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VerifyDocumentsDto } from '../delivery/dto/verify-documents.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('deliveries')
  getAllDeliveries(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAllDeliveries(page, limit);
  }

  @Get('deliveries/:id')
  getDeliveryById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getDeliveryById(id);
  }

  @Patch('verify/:id')
  verifyDocuments(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VerifyDocumentsDto,
  ) {
    return this.adminService.verifyDocuments(id, dto);
  }
}
