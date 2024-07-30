import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Get,
  Query,
} from '@nestjs/common';
import { Workout } from './workout.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutDto } from '../dto/CreateWorkoutDto';
import { WorkoutService } from './workout.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWorkoutDto: CreateWorkoutDto,
    @Request() req,
  ): Promise<Workout> {
    if (req.user.user_id !== createWorkoutDto.user_id) {
      throw new ForbiddenException('You can only edit your own user');
    }
    const validatedDto =
      await this.workoutService.validateCreateWorkoutDto(createWorkoutDto);
    return this.workoutService.createWorkout(validatedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWorkoutsByUser(
    @Request() req,
    @Query('user_id') user_id: string,
  ): Promise<Partial<Workout>[]> {
    const userIdFromReq = String(req.user.user_id);
    if (userIdFromReq !== user_id) {
      throw new ForbiddenException('You can only edit your own user');
    }
    const userIdNumber = parseInt(user_id, 10);
    return this.workoutService.getWorkoutsByUser(userIdNumber);
  }
}
