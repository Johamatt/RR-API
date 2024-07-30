import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkoutDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  place_id: string;
}
