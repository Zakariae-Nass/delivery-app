import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterAgencyDto } from './dto/register-agency.dto';
import { RegisterDeliveryDto } from './dto/register-delivery.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/delivery')
  registerDelivery(@Body() dto: RegisterDeliveryDto) {
    return this.authService.registerDelivery(dto);
  }

  @Post('register/admin')
  registerAdmin(
    @Body() dto: RegisterAdminDto,
    @Headers('x-admin-secret') adminSecret: string,
  ) {
    return this.authService.registerAdmin(dto, adminSecret);
  }

  @Post('register/agency')
  registerAgency(@Body() dto: RegisterAgencyDto) {
    return this.authService.registerAgency(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: { userId: number }) {
    return this.authService.getMe(user.userId);
  }
}
