import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Visit } from '../visits/visits.entity';

@Entity()
export class Place {
  @PrimaryColumn()
  place_id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  coordinates: Point;

  @Column()
  points: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Visit, (visit) => visit.place)
  visits: Visit[];
}
