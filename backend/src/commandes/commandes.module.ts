import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from '../notifications/notifications.module';
import { Agency } from '../users/entities/agency.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { WalletModule } from '../wallet/wallet.module';
import { RevenuPlateforme } from '../wallet/entities/revenu-plateforme.entity';
import { CommandesController } from './commandes.controller';
import { CommandesService } from './commandes.service';
import { Commande } from './entities/commande.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commande, Agency, Delivery, RevenuPlateforme]),
    WalletModule,
    NotificationsModule,
  ],
  controllers: [CommandesController],
  providers: [CommandesService],
  exports: [CommandesService],
})
export class CommandesModule {}
