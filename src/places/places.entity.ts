import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  Polygon,
  Point,
  LineString,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Visit } from '../visits/visits.entity';
import { Address } from '../address/address.entity';

@Entity()
export class Place {
  @PrimaryColumn()
  place_id: string;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  point_coordinates: Point;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  polygon_coordinates: Polygon;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
  })
  linestring_coordinates: LineString;

  @OneToMany(() => Visit, (visit) => visit.place)
  visits: Visit[];

  @OneToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column()
  name_fi: string;

  @Index()
  @Column()
  liikuntapaikkatyyppi: string;

  @Column()
  liikuntapaikkatyypinalaryhmä: string;

  @Column()
  liikuntapaikkatyypinpääryhmä: string;

  @Column({ nullable: true })
  muokattu_viimeksi?: string;

  @Column({ nullable: true })
  markkinointinimi?: string;

  @Column({ nullable: true })
  lisätieto?: string;

  @Column({ nullable: true })
  www?: string;

  @Column({ nullable: true })
  puhelinnumero?: string;

  @Column({ nullable: true })
  sähköposti?: string;
}
