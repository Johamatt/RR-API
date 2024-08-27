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
    const features = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.point_coordinates IS NOT NULL')
      .select([
        "'Feature' AS type",
        `ST_AsGeoJSON(place.point_coordinates)::json AS geometry`,
        `JSON_BUILD_OBJECT('place_id', place.place_id, 'name_fi', place.name_fi, 'katuosoite', address.katuosoite, 'liikuntapaikkatyyppi', place.liikuntapaikkatyyppi) AS properties`,
      ])
      .getRawMany();
    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async findByliikuntapaikkatyypit(
    liikuntapaikkatyyppi: string[],
  ): Promise<GeoJsonPointsResponse> {
    const features = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.liikuntapaikkatyyppi IN (:...liikuntapaikkatyyppi)', {
        liikuntapaikkatyyppi,
      })
      .andWhere('place.point_coordinates IS NOT NULL')
      .select([
        "'Feature' AS type",
        `ST_AsGeoJSON(place.point_coordinates)::json AS geometry`,
        `JSON_BUILD_OBJECT('place_id', place.place_id, 'name_fi', place.name_fi, 'katuosoite', address.katuosoite, 'liikuntapaikkatyyppi', place.liikuntapaikkatyyppi) AS properties`,
      ])
      .getRawMany();

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  public async searchGeoJsonPoints(
    search: string,
  ): Promise<GeoJsonPointsResponse> {
    const features = await this.repository
      .createQueryBuilder('place')
      .leftJoinAndSelect('place.address', 'address')
      .where('place.point_coordinates IS NOT NULL')
      .andWhere('LOWER(place.name_fi) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      })
      .select([
        "'Feature' AS type",
        `ST_AsGeoJSON(place.point_coordinates)::json AS geometry`,
        `JSON_BUILD_OBJECT('place_id', place.place_id, 'name_fi', place.name_fi, 'katuosoite', address.katuosoite, 'liikuntapaikkatyyppi', place.liikuntapaikkatyyppi) AS properties`,
      ])
      .getRawMany();

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
