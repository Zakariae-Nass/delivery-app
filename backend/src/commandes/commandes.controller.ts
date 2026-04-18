import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandesService } from './commandes.service';
import { ConfirmDeliveryDto } from './dto/confirm-delivery.dto';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { RateCommandeDto } from './dto/rate-commande.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

interface JwtUser {
  userId: number;
  role: string;
}

const imageStorage = diskStorage({
  destination: './uploads/commandes',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}${extname(file.originalname)}`);
  },
});

@Controller('commandes')
@UseGuards(JwtAuthGuard)
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Post()
  create(@GetUser() user: JwtUser, @Body() dto: CreateCommandeDto) {
    return this.commandesService.create(user.userId, dto);
  }

  @Get('available')
  findAvailable() {
    return this.commandesService.findAvailable();
  }

  @Get('mine')
  findMine(@GetUser() user: JwtUser) {
    return this.commandesService.findByAgence(user.userId);
  }

  @Get('my-applications')
  findMyApplications(@GetUser() user: JwtUser) {
    return this.commandesService.findMyApplications(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commandesService.findOne(id);
  }

  @Get(':id/applications')
  getApplications(@Param('id', ParseIntPipe) id: number) {
    return this.commandesService.getApplications(id);
  }

  @Post(':id/apply')
  apply(@Param('id', ParseIntPipe) id: number, @GetUser() user: JwtUser) {
    return this.commandesService.apply(id, user.userId);
  }

  @Post(':id/select/:livreurId')
  selectLivreur(
    @Param('id', ParseIntPipe) id: number,
    @Param('livreurId', ParseIntPipe) livreurId: number,
  ) {
    return this.commandesService.selectLivreur(id, livreurId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.commandesService.updateStatus(id, user.userId, dto);
  }

  @Post(':id/upload-pickup-image')
  @UseInterceptors(FileInterceptor('image', { storage: imageStorage }))
  uploadPickupImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/commandes/${file.filename}`;
    return this.commandesService.uploadPickupImage(id, user.userId, url);
  }

  @Post(':id/upload-delivery-image')
  @UseInterceptors(FileInterceptor('image', { storage: imageStorage }))
  uploadDeliveryImage(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/commandes/${file.filename}`;
    return this.commandesService.uploadDeliveryImage(id, user.userId, url);
  }

  @Post(':id/confirm-delivery')
  confirmDelivery(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @Body() dto: ConfirmDeliveryDto,
  ) {
    return this.commandesService.confirmDelivery(id, user.userId, dto);
  }

  @Post(':id/rate')
  rateCommande(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @Body() dto: RateCommandeDto,
  ) {
    return this.commandesService.rateCommande(id, user.userId, dto);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number, @GetUser() user: JwtUser) {
    return this.commandesService.cancel(id, user.userId);
  }
}
