import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacesService } from './places.service';
import { Place } from './places.entity';
import { PlacesController } from './places.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  providers: [PlacesService],
  exports: [PlacesService],
  controllers: [PlacesController],
})
export class PlacesModule {}
