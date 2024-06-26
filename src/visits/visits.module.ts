import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';
import { Visit } from './visits.entity';
import { VisitsController } from './visits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), UsersModule, PlacesModule],
  providers: [VisitsService],
  controllers: [VisitsController],
  exports: [VisitsService],
})
export class VisitsModule {}
