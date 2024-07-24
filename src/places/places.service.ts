import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './places.entity';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { GeoJsonPointsRequest } from '../dto/MapPointRequest';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly repository: Repository<Place>,
  ) {}

  public async findById(place_id: string): Promise<Place | undefined> {
    return this.repository.findOne({
      where: { place_id },
      relations: ['address'],
    });
  }

  public async GeoJsonPoints(): Promise<GeoJsonDto> {
    const places = await this.repository.find({
      relations: ['address'],
    });

    const features: GeoJsonPointsRequest = places
      .filter((place) => place.point_coordinates)
      .map((place) => ({
        type: 'Feature',
        geometry: place.point_coordinates,
        properties: {
          place_id: place.place_id,
          name_fi: place.name_fi,
          katuosoite: place.address.katuosoite,
          liikuntapaikkatyyppi: place.liikuntapaikkatyyppi,
        },
      }));

    console.log(features[0]);
    console.log(features[1]);

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
