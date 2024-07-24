import { Place } from '../places/places.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  katuosoite: string;

  @Column()
  postinumero: string;

  @Column()
  kunta: string;

  @Column({ nullable: true })
  kuntaosa?: string;

  @Column({ nullable: true })
  postitoimipaikka?: string;

  @Column({ nullable: true })
  maakunta?: string;
}
