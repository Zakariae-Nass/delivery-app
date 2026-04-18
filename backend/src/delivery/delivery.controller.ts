import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
import { UpdateLivreurProfileDto } from './dto/update-livreur-profile.dto';
import { UpdateLivreurStatusDto } from './dto/update-livreur-status.dto';
import { UploadDocumentsDto } from './dto/upload-documents.dto';

const photoStorage = diskStorage({
  destination: './uploads/photos',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('delivery')
@Controller('livreurs')
export class LivreursController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('me')
  getMe(@GetUser() user: { userId: number }) {
    return this.deliveryService.getProfile(user.userId);
  }

  @Patch('me')
  updateMe(
    @GetUser() user: { userId: number },
    @Body() dto: UpdateLivreurProfileDto,
  ) {
    return this.deliveryService.updateLivreurProfile(user.userId, dto);
  }

  @Patch('me/status')
  updateStatus(
    @GetUser() user: { userId: number },
    @Body() dto: UpdateLivreurStatusDto,
  ) {
    return this.deliveryService.updateStatus(user.userId, dto.status);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('photo', { storage: photoStorage }))
  uploadPhoto(
    @GetUser() user: { userId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/photos/${file.filename}`;
    return this.deliveryService.updatePhoto(user.userId, url);
  }

  @Post('me/kyc')
  @UseInterceptors(FileInterceptor('document', { storage: photoStorage }))
  uploadKyc(
    @GetUser() user: { userId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/photos/${file.filename}`;
    return this.deliveryService.updateKyc(user.userId, url);
  }
}
