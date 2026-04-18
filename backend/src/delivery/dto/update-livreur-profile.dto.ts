import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateLivreurProfileDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  @Matches(/^0[67]\d{8}$/, { message: 'Phone must be Moroccan format' })
  phone: string;

  @IsString()
  @IsOptional()
  vehicleType: string;
}
