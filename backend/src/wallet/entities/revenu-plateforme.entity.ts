import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Commande } from '../../commandes/entities/commande.entity';

@Entity('revenus_plateforme')
export class RevenuPlateforme {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Commande, { eager: false })
  commande: Commande;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_total: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_livreur: number;

  @Column('decimal', { precision: 10, scale: 2 })
  commission: number;

  @CreateDateColumn()
  createdAt: Date;
}
