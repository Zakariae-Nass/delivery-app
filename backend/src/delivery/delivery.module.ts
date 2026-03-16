import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocVerification } from '../users/entities/doc-verification.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, DocVerification])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService, TypeOrmModule],
})
export class DeliveryModule {}
