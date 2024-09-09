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
import { WorkoutDto } from '../common/dto/WorkoutDto';
import { WorkoutService } from './workout.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createWorkoutDto: WorkoutDto,
    @Request() req,
  ): Promise<Workout> {
    if (req.user.user_id !== createWorkoutDto.user_id) {
      throw new ForbiddenException('You can only edit your own user');
    }
    const validatedDto =
      await this.workoutService.validateWorkoutDto(createWorkoutDto);
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

  @UseGuards(JwtAuthGuard)
  @Get('totals')
  async getWorkoutTotals(
    @Request() req,
    @Query('user_id') user_id: string,
  ): Promise<{
    totalDistance: number;
    totalTime: string;
    latestWorkouts: Workout[];
  }> {
    const userIdFromReq = String(req.user.user_id);
    if (userIdFromReq !== user_id) {
      throw new ForbiddenException('You can only view your own workouts');
    }
    const userIdNumber = parseInt(user_id, 10);
    const totals = await this.workoutService.calculateTotals(userIdNumber);
    const latestWorkouts = await this.workoutService.getLatestWorkouts(
      userIdNumber,
      3,
    );
    console.log(totals);
    return {
      ...totals,
      latestWorkouts,
    };
  }
}
