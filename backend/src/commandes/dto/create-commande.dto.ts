import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommandeDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  price: number;

  @IsString()
  @IsNotEmpty()
  packageType: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight: number;

  @IsString()
  @IsOptional()
  dimension: string;

  @IsString()
  @IsNotEmpty()
  vehiculeType: string;

  @IsBoolean()
  @IsOptional()
  isUrgent: boolean;

  @IsString()
  @MinLength(3)
  clientName: string;

  @IsString()
  @Matches(/^0[67]\d{8}$/, { message: 'Phone must be Moroccan format (06/07 + 8 digits)' })
  clientPhone: string;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsNumber()
  @Type(() => Number)
  pickupLat: number;

  @IsNumber()
  @Type(() => Number)
  pickupLng: number;

  @IsNumber()
  @Type(() => Number)
  deliveryLat: number;

  @IsNumber()
  @Type(() => Number)
  deliveryLng: number;
}
