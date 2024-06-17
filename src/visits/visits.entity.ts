import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Place } from '../places/places.entity';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  visit_id: number;

  @ManyToOne(() => User, (user) => user.visits)
  user: User;

  @ManyToOne(() => Place, (place) => place.visits)
  place: Place;

  @Column()
  visit_date: Date;

  @Column()
  points_awarded: number;

  @CreateDateColumn()
  created_at: Date;
}
