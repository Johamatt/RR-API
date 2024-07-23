import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
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
  async getVisitsByUser(): Promise<GeoJsonDto> {
    return this.service.GeoJsonPoints();
  }

  @Get(':id')
  public getPlace(@Param('id') id: string): Promise<Place> {
    return this.service.findById(id);
  }
}
