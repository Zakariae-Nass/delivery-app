import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { calculateProfileCompleteness } from '../common/helpers/profile-completeness.helper';
import { Admin } from '../users/entities/admin.entity';
import { Agency } from '../users/entities/agency.entity';
import { Delivery } from '../users/entities/delivery.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { RegisterAgencyDto } from './dto/register-agency.dto';
import { RegisterDeliveryDto } from './dto/register-delivery.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerDelivery(dto: RegisterDeliveryDto) {
    await this.checkUnique(dto.email, dto.username);

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.deliveryRepository.create({
      ...dto,
      password: hashed,
    });
    const saved = await this.deliveryRepository.save(user);

    return { message: 'Delivery user registered successfully', userId: saved.id };
  }

  async registerAdmin(dto: RegisterAdminDto, adminSecret: string) {
    const expectedSecret = this.configService.get<string>(
      'ADMIN_SECRET_KEY',
      '',
    );
    if (adminSecret !== expectedSecret) {
      throw new UnauthorizedException('Invalid admin secret key');
    }

    await this.checkUnique(dto.email, dto.username);

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.adminRepository.create({ ...dto, password: hashed });
    const saved = await this.adminRepository.save(user);

    return { message: 'Admin user registered successfully', userId: saved.id };
  }

  async registerAgency(dto: RegisterAgencyDto) {
    await this.checkUnique(dto.email, dto.username);

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.agencyRepository.create({ ...dto, password: hashed });
    const saved = await this.agencyRepository.save(user);

    return { message: 'Agency user registered successfully', userId: saved.id };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['location'],
    });
    if (!user) throw new UnauthorizedException('User not found');

    let fullUser: User = user;
    if (user.role === 'delivery') {
      const delivery = await this.deliveryRepository.findOne({
        where: { id: userId },
        relations: ['location', 'docVerification'],
      });
      if (delivery) fullUser = delivery;
    }

    const completeness = calculateProfileCompleteness(fullUser);
    const { password: _pw, ...userWithoutPassword } = fullUser as User & { password: string };
    return { user: userWithoutPassword, ...completeness };
  }

  private async checkUnique(email: string, username: string) {
    const byEmail = await this.userRepository.findOne({ where: { email } });
    if (byEmail) {
      throw new ConflictException('Email already in use');
    }

    const byUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (byUsername) {
      throw new BadRequestException('Username already taken');
    }
  }
}
