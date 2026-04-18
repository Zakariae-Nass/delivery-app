import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  solde: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  solde_bloque: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
