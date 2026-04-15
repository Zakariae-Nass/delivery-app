import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDeliveryProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;

  @IsOptional()
  @IsString()
  vehicleType?: string;
}
