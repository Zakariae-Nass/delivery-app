import { IsString } from 'class-validator';

export class UploadDocumentsDto {
  @IsString()
  cin: string;

  @IsString()
  licence: string;
}
