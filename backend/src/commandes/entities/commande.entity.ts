import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agency } from '../../users/entities/agency.entity';
import { Delivery } from '../../users/entities/delivery.entity';

export type CommandeStatus =
  | 'en_attente'
  | 'en_cours_pickup'
  | 'colis_recupere'
  | 'livree'
  | 'annulee';

@Entity('commandes')
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  packageType: string;

  @Column({ type: 'varchar', default: 'en_attente' })
  status: CommandeStatus;

  @Column('float', { nullable: true })
  weight: number;

  @Column({ nullable: true })
  dimension: string;

  @Column()
  vehiculeType: string;

  @Column({ default: false })
  isUrgent: boolean;

  @Column()
  clientName: string;

  @Column()
  clientPhone: string;

  @Column()
  pickupAddress: string;

  @Column()
  deliveryAddress: string;

  @Column('float')
  pickupLat: number;

  @Column('float')
  pickupLng: number;

  @Column('float')
  deliveryLat: number;

  @Column('float')
  deliveryLng: number;

  @Column({ nullable: true })
  pickupImageUrl: string;

  @Column({ nullable: true })
  deliveryImageUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  otpCode: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiresAt: Date;

  @ManyToOne(() => Agency, { eager: true })
  agence: Agency;

  @ManyToOne(() => Delivery, { nullable: true, eager: true })
  livreur: Delivery | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
