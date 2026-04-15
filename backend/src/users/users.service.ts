import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { Delivery } from './entities/delivery.entity';
import { Location } from './entities/location.entity';
import { User } from './entities/user.entity';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async updateLocation(userId: number, dto: UpdateLocationDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['location'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.location) {
      await this.locationRepository.update(user.location.id, dto);
      user.location = { ...user.location, ...dto };
    } else {
      const location = this.locationRepository.create(dto);
      user.location = await this.locationRepository.save(location);
    }

    await this.userRepository.save(user);
    return { message: 'Location updated successfully', location: user.location };
  }

  async getProfileStatus(userId: number, role: string) {
    let fullUser: User;
    if (role === 'delivery') {
      const delivery = await this.deliveryRepository.findOne({
        where: { id: userId },
        relations: ['location', 'docVerification'],
      });
      if (!delivery) throw new NotFoundException('User not found');
      fullUser = delivery;
    } else {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['location'],
      });
      if (!user) throw new NotFoundException('User not found');
      fullUser = user;
    }
    return calculateProfileCompleteness(fullUser);
  }
}
