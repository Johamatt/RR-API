import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { CreatePlaceDto } from '../dto/CreatePlaceDto';
import { GeoJsonDto } from '../dto/GeoJsonDto';
import { Country } from '../enums/Country';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.findById(id);
  }

  @Post()
  public createPlace(@Body() body: CreatePlaceDto): Promise<Place> {
    return this.service.createPlace(body);
  }

  @Get()
  public findAll(): Promise<GeoJsonDto> {
    return this.service.findAll();
  }

  @Get('country/:country')
  public findByCountry(
    @Param('country', new ParseEnumPipe(Country)) country: Country,
  ): Promise<GeoJsonDto> {
    return this.service.findByCountry(country);
  }

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
