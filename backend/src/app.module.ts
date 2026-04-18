import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AgencyModule } from './agency/agency.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommandesModule } from './commandes/commandes.module';
import { getTypeOrmConfig } from './config/typeorm.config';
import { DeliveryModule } from './delivery/delivery.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TrackingModule } from './tracking/tracking.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    AuthModule,
    UsersModule,
    DeliveryModule,
    AdminModule,
    AgencyModule,
    CommandesModule,
    WalletModule,
    TrackingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
