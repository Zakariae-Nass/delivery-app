import { IsString, Length } from 'class-validator';

export class ConfirmDeliveryDto {
  @IsString()
  @Length(4, 4)
  otpCode: string;
}
