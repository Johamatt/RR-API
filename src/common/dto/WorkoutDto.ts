import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { LineString } from 'typeorm';

export class WorkoutDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  name: String;

  @IsOptional()
  linestring_coordinates?: LineString;

  @IsString()
  @Matches(/^\d{2}:\d{2}:\d{2}$/, {
    message: 'Duration must be in the format hh:mm:ss',
  })
  time: string;

  @IsNotEmpty()
  distanceMeters: number;

  @IsOptional()
  sport?: String;
}
