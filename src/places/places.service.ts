import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './places.entity';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { MapPointsByCountryRequest } from '../dto/MapPointRequest';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly repository: Repository<Place>,
  ) {}

  public findById(placeId: string): Promise<Place> {
    return this.repository.findOne({ where: { placeId } });
  }

  public async findPointsByCountry(country: string): Promise<GeoJsonDto> {
    const places = await this.repository.find({ where: { country } });

    const features: MapPointsByCountryRequest = places
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

  public async checkProximity(
    userLatitude: number,
    userLongitude: number,
    markerLatitude: number,
    markerLongitude: number,
  ): Promise<{ isNearby: boolean }> {
    const proximityThreshold = 0.005;
    const latitudeDifference = Math.abs(userLatitude - markerLatitude);
    const longitudeDifference = Math.abs(userLongitude - markerLongitude);
    const isNearby =
      latitudeDifference <= proximityThreshold &&
      longitudeDifference <= proximityThreshold;
    return { isNearby };
  }
}
