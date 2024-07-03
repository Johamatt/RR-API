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

  public findById(place_id: string): Promise<Place> {
    return this.repository.findOne({ where: { place_id } });
  }

  
  public createPlace(body: CreatePlaceDto): Promise<Place> {
    const place: Place = new Place();

    place.name = body.name;
    place.description = body.description;
    place.coordinates = body.coordinates;
    place.points = body.points;

    return this.repository.save(place);
  }

  public async findAll(): Promise<GeoJsonDto> {
    const places = await this.repository.find();
    const features = places.map((place) => ({
      type: 'Feature',
      geometry: place.coordinates,
      properties: {
        place_id: place.place_id,
        name: place.name,
        description: place.description,
        points: place.points,
        created_at: place.created_at,
        updated_at: place.updated_at,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async findByCountry(country: string): Promise<GeoJsonDto> {
    const places = await this.repository.find({ where: { country } });
    const features = places.map((place) => ({
      type: 'Feature',
      geometry: place.coordinates,
      properties: {
        place_id: place.place_id,
        name: place.name,
        description: place.description,
        points: place.points,
        created_at: place.created_at,
        updated_at: place.updated_at,
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
