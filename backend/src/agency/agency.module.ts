import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AgencyController } from './agency.controller';
import { AgencyService } from './agency.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
