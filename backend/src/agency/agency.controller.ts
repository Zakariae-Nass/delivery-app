import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AgencyService } from './agency.service';

const photoStorage = diskStorage({
  destination: './uploads/photos',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('agency')
@Controller('agences')
export class AgencesController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get('me')
  getMe(@GetUser() user: { userId: number }) {
    return this.agencyService.getProfile(user.userId);
  }

  @Patch('me')
  updateMe(
    @GetUser() user: { userId: number },
    @Body() dto: { username?: string; phone?: string },
  ) {
    return this.agencyService.updateProfile(user.userId, dto);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('photo', { storage: photoStorage }))
  uploadPhoto(
    @GetUser() user: { userId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/photos/${file.filename}`;
    return this.agencyService.updatePhoto(user.userId, url);
  }
}
