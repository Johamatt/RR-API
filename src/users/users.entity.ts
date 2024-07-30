import { Visit } from '../visits/visits.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Visit, (visit) => visit.user)
  visits: Visit[];
}
