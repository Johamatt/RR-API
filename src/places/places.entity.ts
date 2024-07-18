import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  Polygon,
  Point,
  LineString,
  Index,
} from 'typeorm';

import { Visit } from '../visits/visits.entity';

@Entity()
export class Place {
  @PrimaryColumn()
  placeId: string;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  pointCoordinates: Point;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  polygonCoordinates: Polygon;

  @Index({ spatial: true })
  @Column({
    nullable: true,
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
  })
  linestringCoordinates: LineString;

  @OneToMany(() => Visit, (visit) => visit.place)
  visits: Visit[];

  @Column()
  country: string;

  @Column()
  nameFi: string;

  @Column()
  public liikuntapaikkaTyyppi: string;

  @Column()
  liikuntapaikkatyypinAlaryhmä: string;

  @Column()
  liikuntapaikkatyypinPääryhmä: string;

  @Column()
  katuosoite: string;

  @Column()
  postinumero: string;

  @Column({ nullable: true })
  www?: string;

  @Column({ nullable: true })
  kunta?: string;

  @Column({ nullable: true })
  kuntaosa?: string;

  @Column({ type: 'float', nullable: true })
  liikuntapintaalaM2?: number;

  @Column({ nullable: true })
  postitoimipaikka?: string;

  @Column({ nullable: true })
  lisätieto?: string;

  @Column({ nullable: true })
  muokattuViimeksi?: string;

  @Column({ type: 'float', nullable: true })
  kentänLeveysM?: number;

  @Column({ type: 'float', nullable: true })
  kentänPituusM?: number;

  @Column({ nullable: true })
  puhelinnumero?: string;

  @Column({ nullable: true })
  pintamateriaaliLisätieto?: string;

  @Column({ nullable: true })
  markkinointinimi?: string;

  @Column({ nullable: true })
  omistaja?: string;

  @Column({ nullable: true })
  maakunta?: string;

  @Column({ nullable: true })
  pintamateriaali?: string;

  @Column({ nullable: true })
  sähköposti?: string;

  @Column({ nullable: true })
  peruskorjausvuodet?: string;

  @Column({ nullable: true })
  aviAlue?: string;
}
