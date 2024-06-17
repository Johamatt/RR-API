import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './visits.entity';
import { User } from '../users/users.entity';
import { Place } from '../places/places.entity';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visit, User, Place])],
  providers: [VisitsService],
  controllers: [VisitsController],
})
export class VisitsModule {}
