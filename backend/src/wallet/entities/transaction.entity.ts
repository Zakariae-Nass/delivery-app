import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export type TransactionType = 'credit' | 'debit' | 'blocage' | 'deblocage';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, { eager: false })
  wallet: Wallet;

  @Column({ type: 'varchar' })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
