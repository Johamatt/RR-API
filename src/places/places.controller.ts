import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { Country } from '../enums/Country';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('country/:country')
  public findByCountry(
    @Param('country', new ParseEnumPipe(Country)) country: Country,
  ): Promise<GeoJsonDto> {
    return this.service.findPointsByCountry(country);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-proximity')
  public async checkProximity(
    @Body() body: any,
  ): Promise<{ isNearby: boolean }> {
    const userLatitude = body.userLatitude;
    const userLongitude = body.userLongitude;
    const markerLatitude = body.markerLatitude;
    const markerLongitude = body.markerLongitude;

    return this.service.checkProximity(
      userLatitude,
      userLongitude,
      markerLatitude,
      markerLongitude,
    );
  }
}
