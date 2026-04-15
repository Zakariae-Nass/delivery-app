import { ChildEntity } from 'typeorm';
import { User } from './user.entity';

@ChildEntity('agency')
export class Agency extends User {}
