import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GeoJsonPointsResponse } from 'src/common/dto/MapPointRequest';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @UseGuards(JwtAuthGuard)
  @Get('GeoJsonPoints')
  async getPlacesGeoJson(): Promise<GeoJsonPointsResponse> {
    return this.service.GeoJsonPoints();
  }

  @Get('SearchGeoJsonPoints')
  async searchPlacesGeoJson(
    @Query('search') search: string,
  ): Promise<GeoJsonPointsResponse> {
    return this.service.searchGeoJsonPoints(search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('GeoJsonPointsByLiikuntapaikkatyyppi')
  public async getPlacesGeoJsonByLiikuntapaikkatyyppi(
    @Query('liikuntapaikkatyyppi') liikuntapaikkatyyppi: string | string[],
  ): Promise<GeoJsonPointsResponse> {
    console.log('Received liikuntapaikkatyyppi:', liikuntapaikkatyyppi);

    const liikuntapaikkatyyppiArray = Array.isArray(liikuntapaikkatyyppi)
      ? liikuntapaikkatyyppi
      : [liikuntapaikkatyyppi];

    return this.service.findByliikuntapaikkatyypit(liikuntapaikkatyyppiArray);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public async getPlace(@Param('id') id: string): Promise<Place> {
    const place = await this.service.findById(id);
    if (!place) {
      throw new NotFoundException('Place not found');
    }
    return place;
  }
}
