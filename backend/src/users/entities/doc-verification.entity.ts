import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DocStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('doc_verifications')
export class DocVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cin: string;

  @Column()
  cinImage: string;

  @Column()
  licence: string;

  @Column()
  licenceImage: string;

  @Column({
    type: 'enum',
    enum: DocStatus,
    default: DocStatus.PENDING,
  })
  status: DocStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date | null;
}
