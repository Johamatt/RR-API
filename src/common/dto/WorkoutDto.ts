import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { LineString, Point } from 'typeorm';

export class WorkoutDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  name: String;

  @IsOptional()
  point_coordinates?: Point;

  @IsOptional()
  linestring_coordinates?: LineString;

  @IsOptional()
  duration?: String;

  @IsOptional()
  sport?: String;

  @IsOptional()
  notes?: String;
}
