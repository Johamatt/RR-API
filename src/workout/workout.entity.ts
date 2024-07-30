import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Place } from '../places/places.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  workout_id: number;

  @ManyToOne(() => User, (user) => user.workouts)
  user: User;

  @ManyToOne(() => Place, (place) => place.workouts)
  place: Place;

  @CreateDateColumn()
  created_at: Date;
}
