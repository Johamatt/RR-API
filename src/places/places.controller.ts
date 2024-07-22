import {
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { Country } from '../enums/Country';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @UseGuards(JwtAuthGuard)
  @Get('GeoJsonPointsByCountry')
  async getVisitsByUser(
    @Query('country', new ParseEnumPipe(Country)) country: Country,
  ): Promise<GeoJsonDto> {
    return this.service.GeoJsonPointsByCountry(country);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.findById(id);
  }
}
