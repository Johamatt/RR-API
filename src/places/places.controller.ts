import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { CreatePlaceDto } from './CreatePlaceDto';
import { GeoJsonDto } from './GeoJsonDto';

@Controller('places')
export class PlacesController {
  @Inject(PlacesService)
  private readonly service: PlacesService;

  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.getPlace(id);
  }

  @Post()
  public createPlace(@Body() body: CreatePlaceDto): Promise<Place> {
    return this.service.createPlace(body);
  }

  @Get()
  public findAll(): Promise<GeoJsonDto> {
    return this.service.findAll();
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
