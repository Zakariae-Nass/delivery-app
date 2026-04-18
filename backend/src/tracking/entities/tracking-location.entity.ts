import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tracking_locations')
export class TrackingLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  livreurId: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column('float', { nullable: true })
  speed: number;

  @Column('float', { nullable: true })
  heading: number;

  @CreateDateColumn()
  createdAt: Date;
}
