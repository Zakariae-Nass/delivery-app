import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocVerification } from '../users/entities/doc-verification.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, DocVerification])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
