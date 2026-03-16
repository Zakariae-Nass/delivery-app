import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboard(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['location'],
    });
    if (!user) throw new NotFoundException('User not found');

    const completeness = calculateProfileCompleteness(user);
    const { password: _pw, ...userWithoutPassword } = user as User & { password: string };
    return { message: 'Welcome to your agency dashboard', user: userWithoutPassword, ...completeness };
  }
}
