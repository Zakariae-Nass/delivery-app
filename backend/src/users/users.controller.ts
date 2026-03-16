import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('location')
  updateLocation(
    @GetUser() user: { userId: number; role: string },
    @Body() dto: UpdateLocationDto,
  ) {
    return this.usersService.updateLocation(user.userId, dto);
  }

  @Get('profile-status')
  getProfileStatus(@GetUser() user: { userId: number; role: string }) {
    return this.usersService.getProfileStatus(user.userId, user.role);
  }
}
