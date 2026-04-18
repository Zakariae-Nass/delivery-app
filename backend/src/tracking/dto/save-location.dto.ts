import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SaveLocationDto {
  @IsString()
  livreurId: string;

  @IsString()
  commandeId: string;

  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  speed: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  heading: number;
}
