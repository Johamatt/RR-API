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

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  point_coordinates?: Point;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
    nullable: true,
  })
  linestring_coordinates?: LineString;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  duration?: String;

  @Column()
  sport: String;
}
