import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RateCommandeDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  stars: number;

  @IsString()
  @IsOptional()
  comment: string;
}
