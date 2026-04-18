import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Commande } from '../commandes/entities/commande.entity';
import { TrackingLocation } from '../tracking/entities/tracking-location.entity';
import { Admin } from '../users/entities/admin.entity';
import { Agency } from '../users/entities/agency.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { DocVerification } from '../users/entities/doc-verification.entity';
import { Location } from '../users/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { RevenuPlateforme } from '../wallet/entities/revenu-plateforme.entity';
import { Transaction } from '../wallet/entities/transaction.entity';
import { Wallet } from '../wallet/entities/wallet.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
  database: configService.get<string>('DATABASE_NAME', 'delivery_app'),
  entities: [
    User,
    Delivery,
    Admin,
    Agency,
    Location,
    DocVerification,
    Commande,
    Wallet,
    Transaction,
    RevenuPlateforme,
    TrackingLocation,
  ],
  synchronize: true,
  logging: false,
});
