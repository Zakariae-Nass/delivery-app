import { ChildEntity, Column } from 'typeorm';
import { User } from './user.entity';

@ChildEntity('agency')
export class Agency extends User {
  @Column({ type: 'varchar', nullable: true })
  photoUrl: string | null;
}
