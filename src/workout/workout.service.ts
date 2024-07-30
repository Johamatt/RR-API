import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateWorkoutDto } from '../dto/CreateWorkoutDto';
import { Workout } from './workout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    private readonly userService: UsersService,
    private readonly placeService: PlacesService,
  ) {}

  async validateCreateWorkoutDto(
    CreateWorkoutDto: CreateWorkoutDto,
  ): Promise<CreateWorkoutDto> {
    const errors = await validate(CreateWorkoutDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return CreateWorkoutDto;
  }

  async createWorkout(CreateWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { user_id, place_id } = CreateWorkoutDto;

    const user = await this.userService.findById(user_id);
    const place = await this.placeService.findById(place_id);

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    if (!place) {
      throw new NotFoundException(`Place with ID ${place_id} not found`);
    }

    const newWorkout = new Workout();
    newWorkout.user = user;
    newWorkout.place = place;

    return this.workoutRepository.save(newWorkout);
  }

  async getWorkoutsByUser(userId: number): Promise<Partial<Workout>[]> {
    const workouts = await this.workoutRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user', 'place'],
    });

    return workouts.map((workout) => {
      const { user, ...workoutWithoutUser } = workout;
      return workoutWithoutUser;
    });
  }
}
