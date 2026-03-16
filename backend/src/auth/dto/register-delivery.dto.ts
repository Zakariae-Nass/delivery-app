import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDeliveryDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;
}
