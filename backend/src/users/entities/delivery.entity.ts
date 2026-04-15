import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { DocVerification } from './doc-verification.entity';

@ChildEntity('delivery')
export class Delivery extends User {
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  rate: number | null;

  @Column({ type: 'varchar', nullable: true })
  vehicleType: string | null;

  @OneToOne(() => DocVerification, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  docVerification: DocVerification | null;
}
