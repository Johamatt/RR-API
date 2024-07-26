import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @UseGuards(JwtAuthGuard)
  @Get('GeoJsonPoints')
  async getPlacesGeoJson(): Promise<GeoJsonDto> {
    return this.service.GeoJsonPoints();
  }

  @UseGuards(JwtAuthGuard)
  @Get('GeoJsonPointsByLiikuntapaikkatyyppi')
  public async getPlacesGeoJsonByLiikuntapaikkatyyppi(
    @Query('liikuntapaikkatyyppi') liikuntapaikkatyyppi: string | string[],
  ): Promise<GeoJsonDto> {
    console.log('Received liikuntapaikkatyyppi:', liikuntapaikkatyyppi);

    const liikuntapaikkatyyppiArray = Array.isArray(liikuntapaikkatyyppi)
      ? liikuntapaikkatyyppi
      : [liikuntapaikkatyyppi];

    return this.service.findByliikuntapaikkatyypit(liikuntapaikkatyyppiArray);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.findById(id);
  }
}
