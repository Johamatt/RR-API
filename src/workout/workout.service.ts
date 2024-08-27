import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutDto } from '../common/dto/WorkoutDto';
import { Workout } from './workout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { formatTime } from '../common/helpers/calculateTime';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private readonly userService: UsersService,
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

  async calculateTotals(
    userId: number,
  ): Promise<{ totalDistanceKM: number; totalTime: string }> {
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
      .where('workout.user = :userId', { userId })
      .getRawOne();

    const totalDistanceKM = parseFloat(
      (result.totalDistanceMeters / 1000).toFixed(2),
    );
    const totalTime = formatTime(result.totalTimeInSeconds);

    return {
      totalDistanceKM,
      totalTime,
    };
  }
}
