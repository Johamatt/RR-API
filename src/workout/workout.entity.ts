import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Index,
  Point,
  LineString,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Workout {
  @PrimaryGeneratedColumn()
  workout_id: number;

  @ManyToOne(() => User, (user) => user.workouts)
  user: User;

  @Column()
  name: String;

  @Column()
  sport: String;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
    nullable: true,
  })
  linestring_coordinates?: LineString;

  @Column({ type: 'float' })
  distanceMeters: number;

  @Column({ type: 'time', nullable: true })
  time: string;

  @CreateDateColumn()
  created_at: Date;
}
