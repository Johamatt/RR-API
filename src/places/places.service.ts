import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './places.entity';
import { GeoJsonPointsResponse } from '../common/dto/MapPointRequest';

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

  public async GeoJsonPoints(): Promise<GeoJsonPointsResponse> {
    const places = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.point_coordinates IS NOT NULL')
      .select([
        'place.point_coordinates',
        'place.place_id',
        'place.name_fi',
        'address.katuosoite',
        'place.liikuntapaikkatyyppi',
      ])
      .getMany();

    const features: GeoJsonPointsResponse = places.map((place) => ({
      type: 'Feature',
      geometry: place.point_coordinates,
      properties: {
        place_id: place.place_id,
        name_fi: place.name_fi,
        katuosoite: place.address.katuosoite,
        liikuntapaikkatyyppi: place.liikuntapaikkatyyppi,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async findByliikuntapaikkatyypit(
    liikuntapaikkatyyppi: string[],
  ): Promise<GeoJsonPointsResponse> {
    const places = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.liikuntapaikkatyyppi IN (:...liikuntapaikkatyyppi)', {
        liikuntapaikkatyyppi,
      })
      .andWhere('place.point_coordinates IS NOT NULL')
      .select([
        'place.point_coordinates',
        'place.place_id',
        'place.name_fi',
        'address.katuosoite',
        'place.liikuntapaikkatyyppi',
      ])
      .getMany();

    const features: GeoJsonPointsResponse = places.map((place) => ({
      type: 'Feature',
      geometry: place.point_coordinates,
      properties: {
        place_id: place.place_id,
        name_fi: place.name_fi,
        katuosoite: place.address.katuosoite,
        liikuntapaikkatyyppi: place.liikuntapaikkatyyppi,
      },
    }));
    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async searchGeoJsonPoints(
    search: string,
  ): Promise<GeoJsonPointsResponse> {
    const places = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.point_coordinates IS NOT NULL')
      .andWhere('LOWER(place.name_fi) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      })
      .select([
        'place.point_coordinates',
        'place.place_id',
        'place.name_fi',
        'address.katuosoite',
        'place.liikuntapaikkatyyppi',
      ])
      .getMany();

    const features: GeoJsonPointsResponse = places.map((place) => ({
      type: 'Feature',
      geometry: place.point_coordinates,
      properties: {
        place_id: place.place_id,
        name_fi: place.name_fi,
        katuosoite: place.address.katuosoite,
        liikuntapaikkatyyppi: place.liikuntapaikkatyyppi,
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
