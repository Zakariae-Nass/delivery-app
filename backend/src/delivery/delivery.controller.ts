import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  multerDocumentsFileFilter,
  multerDocumentsLimits,
  multerDocumentsStorageConfig,
} from '../config/multer.config';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryProfileDto } from './dto/update-delivery-profile.dto';
import { UploadDocumentsDto } from './dto/upload-documents.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Patch('profile')
  updateProfile(
    @GetUser() user: { userId: number },
    @Body() dto: UpdateDeliveryProfileDto,
  ) {
    return this.deliveryService.updateProfile(user.userId, dto);
  }

  @Post('documents')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cinImage', maxCount: 1 },
        { name: 'licenceImage', maxCount: 1 },
      ],
      {
        storage: multerDocumentsStorageConfig,
        fileFilter: multerDocumentsFileFilter,
        limits: multerDocumentsLimits,
      },
    ),
  )
  uploadDocuments(
    @GetUser() user: { userId: number },
    @Body() dto: UploadDocumentsDto,
    @UploadedFiles()
    files: {
      cinImage?: Express.Multer.File[];
      licenceImage?: Express.Multer.File[];
    },
  ) {
    return this.deliveryService.uploadDocuments(user.userId, dto, files);
  }

  @Get('documents')
  getDocuments(@GetUser() user: { userId: number }) {
    return this.deliveryService.getDocuments(user.userId);
  }

  @Get('dashboard')
  getDashboard(@GetUser() user: { userId: number }) {
    return this.deliveryService.getDashboard(user.userId);
  }
}
