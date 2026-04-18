import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { DocVerification } from './doc-verification.entity';

export type DeliveryStatus = 'online' | 'offline';

@ChildEntity('delivery')
export class Delivery extends User {
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  rate: number | null;

  @Column({ type: 'varchar', nullable: true })
  vehicleType: string | null;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', default: 'offline' })
  status: DeliveryStatus;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  averageNote: number;

  @Column({ type: 'varchar', nullable: true })
  photoUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  kycDocumentUrl: string | null;

  @OneToOne(() => DocVerification, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  docVerification: DocVerification | null;
}
