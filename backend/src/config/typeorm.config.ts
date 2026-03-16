import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Admin } from '../users/entities/admin.entity';
import { Agency } from '../users/entities/agency.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { DocVerification } from '../users/entities/doc-verification.entity';
import { Location } from '../users/entities/location.entity';
import { User } from '../users/entities/user.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
  database: configService.get<string>('DATABASE_NAME', 'delivery_app'),
  entities: [User, Delivery, Admin, Agency, Location, DocVerification],
  synchronize: true,
  logging: false,
});
