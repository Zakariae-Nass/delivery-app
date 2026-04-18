import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from '../users/entities/agency.entity';
import { User } from '../users/entities/user.entity';
import { AgencesController, AgencyController } from './agency.controller';
import { AgencyService } from './agency.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Agency])],
  controllers: [AgencyController, AgencesController],
  providers: [AgencyService],
  exports: [AgencyService],
})
export class AgencyModule {}
