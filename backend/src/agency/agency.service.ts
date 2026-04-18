import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { Agency } from '../users/entities/agency.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
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

  async getProfile(userId: number) {
    const agency = await this.agencyRepository.findOne({ where: { id: userId } });
    if (!agency) throw new NotFoundException('Agency not found');
    const { password: _pw, ...profile } = agency as Agency & { password: string };
    return profile;
  }

  async updateProfile(userId: number, dto: { username?: string; phone?: string }) {
    const agency = await this.agencyRepository.findOne({ where: { id: userId } });
    if (!agency) throw new NotFoundException('Agency not found');
    if (dto.username) agency.username = dto.username;
    if (dto.phone) agency.phone = dto.phone;
    const saved = await this.agencyRepository.save(agency);
    const { password: _pw, ...profile } = saved as Agency & { password: string };
    return { message: 'Profil mis à jour', profile };
  }

  async updatePhoto(userId: number, photoUrl: string) {
    const agency = await this.agencyRepository.findOne({ where: { id: userId } });
    if (!agency) throw new NotFoundException('Agency not found');
    agency.photoUrl = photoUrl;
    await this.agencyRepository.save(agency);
    return { photoUrl };
  }
}
