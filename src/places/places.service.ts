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

  public findById(placeId: string): Promise<Place> {
    return this.repository.findOne({ where: { placeId } });
  }

  public async GeoJsonPoints(): Promise<GeoJsonDto> {
    const places = await this.repository.find();

    const features: GeoJsonPointsRequest = places
      .filter((place) => place.pointCoordinates)
      .map((place) => ({
        type: 'Feature',
        geometry: place.pointCoordinates,
        properties: {
          placeId: place.placeId,
          nameFi: place.nameFi,
          katuosoite: place.katuosoite,
          liikuntapaikkaTyyppi: place.liikuntapaikkaTyyppi,
        },
      }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
