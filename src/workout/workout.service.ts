import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutDto } from '../common/dto/WorkoutDto';
import { Workout } from './workout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LineString, Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { formatTime, parseTimeString } from '../common/helpers/calculateTime';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async validateWorkoutDto(Workout: WorkoutDto): Promise<WorkoutDto> {
    const errors = await validate(Workout);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return Workout;
  }

  async createWorkout(WorkoutReq: WorkoutDto): Promise<Workout> {
    const { user_id } = WorkoutReq;

    const user = await this.userService.findById(user_id);

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    const newWorkout = new Workout();
    newWorkout.linestring_coordinates = WorkoutReq.linestring_coordinates;
    newWorkout.user = user;
    newWorkout.name = WorkoutReq.name;
    newWorkout.time = WorkoutReq.time;
    newWorkout.distanceMeters = WorkoutReq.distanceMeters;

    newWorkout.sport = WorkoutReq.sport;

    return this.workoutRepository.save(newWorkout);
  }

  async getWorkoutsByUser(userId: number): Promise<Partial<Workout>[]> {
    return this.workoutRepository.find({
      where: { user: { user_id: userId } },
      loadRelationIds: false,
    });
  }

  async calculateTotals(userId: number): Promise<{
    totalDistanceKM: number;
    totalTime: string;
    totalWorkouts: number;
  }> {
    const result = await this.workoutRepository
      .createQueryBuilder('workout')
      .select('SUM(workout.distanceMeters)', 'totalDistanceMeters')
      .addSelect(
        `
        SUM(
          EXTRACT(EPOCH FROM workout.time)
        )
      `,
        'totalTimeInSeconds',
      )
      .addSelect('COUNT(workout.workout_id)', 'totalWorkouts')
      .where('workout.user = :userId', { userId })
      .getRawOne();

    const totalDistanceKM = parseFloat(
      (result.totalDistanceMeters / 1000).toFixed(2),
    );
    const totalTime = formatTime(result.totalTimeInSeconds);
    const totalWorkouts = parseInt(result.totalWorkouts, 10);

    return {
      totalDistanceKM,
      totalTime,
      totalWorkouts,
    };
  }

  async getLatestWorkouts(userId: number, limit: number): Promise<any[]> {
    const workouts = await this.workoutRepository
      .createQueryBuilder('workout')
      .where('workout.user = :userId', { userId })
      .orderBy('workout.created_at', 'DESC')
      .limit(limit)
      .getMany();

    return await Promise.all(
      workouts.map(async (workout) => {
        const coordinates = this.extractCoordinates(
          workout.linestring_coordinates,
        );
        const staticMapUrl = await this.generateStaticMapUrl(coordinates);
        return {
          ...workout,
          distanceMeters: parseFloat(
            (workout.distanceMeters / 1000).toFixed(3),
          ),
          time: workout.time ? formatTime(parseTimeString(workout.time)) : null,
          staticMapUrl,
        };
      }),
    );
  }

  private extractCoordinates(linestring: LineString): string {
    return linestring.coordinates
      .map((coordinate) => `${coordinate[0]},${coordinate[1]}`)
      .join(';');
  }

  private async generateStaticMapUrl(coordinates: string): Promise<string> {
    const token = this.configService.get<string>('MAPBOX_ACCESS_TOKEN');
    const path = `path-5+ff0000-0.6(${coordinates})`;
    const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${path}/auto/500x300?access_token=${token}`;

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      if (response.status === 200) {
        // TODO , url contains pk.
        return url;
      } else {
        throw new Error('Failed to generate static map URL');
      }
    } catch (e) {
      console.error(e);
      return '';
    }
  }
}
