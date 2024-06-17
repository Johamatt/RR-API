import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './places.entity';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
