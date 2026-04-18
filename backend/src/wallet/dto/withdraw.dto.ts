import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawDto {
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  montant: number;
}
