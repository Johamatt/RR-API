import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './places.entity';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';
import { GeoJsonDto } from '../dto/GeoJsonDto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly repository: Repository<Place>,
  ) {}

  public findById(placeId: string): Promise<Place> {
    return this.repository.findOne({ where: { placeId } });
  }

  public createPlace(body: CreatePlaceDto): Promise<Place> {
    const place: Place = new Place();

    place.nameFi = body.nameFi;
    place.lisätieto = body.lisätieto;
    place.pointCoordinates = body.pointCoordinates;

    return this.repository.save(place);
  }

  public async findAll(): Promise<GeoJsonDto> {
    const places = await this.repository.find();
    const features = places.map((place) => ({
      type: 'Feature',
      geometry: place.pointCoordinates,
      properties: {
        placeId: place.placeId,
        name: place.nameFi,
        lisätieto: place.lisätieto,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async findPointsByCountry(country: string): Promise<GeoJsonDto> {
    const places = await this.repository.find({ where: { country } });

    const features = places
      .filter((place) => place.pointCoordinates)
      .map((place) => ({
        type: 'Feature',
        geometry: place.pointCoordinates,
        properties: {
          placeId: place.placeId,
          nameFi: place.nameFi,
          lisätieto: place.lisätieto,
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
