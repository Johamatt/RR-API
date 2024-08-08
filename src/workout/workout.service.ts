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
    newWorkout.user = user;
    newWorkout.name = WorkoutReq.name;
    newWorkout.point_coordinates = WorkoutReq.point_coordinates;
    newWorkout.linestring_coordinates = WorkoutReq.linestring_coordinates;
    newWorkout.duration = WorkoutReq.duration;
    newWorkout.sport = WorkoutReq.sport;

    return this.workoutRepository.save(newWorkout);
  }

  async getWorkoutsByUser(userId: number): Promise<Partial<Workout>[]> {
    const workouts = await this.workoutRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
    });

    return workouts.map((workout) => {
      const { user, ...workoutWithoutUser } = workout;
      return workoutWithoutUser;
    });
  }
}
