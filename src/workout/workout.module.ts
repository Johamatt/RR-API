import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutService } from './workout.service';
import { UsersModule } from '../users/users.module';
import { PlacesModule } from '../places/places.module';
import { Workout } from './workout.entity';
import { WorkoutController } from './workout.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout]),
    UsersModule,
    PlacesModule,
    HttpModule,
  ],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [WorkoutService],
})
export class WorkoutsModule {}
