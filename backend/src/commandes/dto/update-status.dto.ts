import { IsIn, IsString } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsIn(['en_attente', 'en_cours_pickup', 'colis_recupere', 'livree', 'annulee'])
  status: string;
}
