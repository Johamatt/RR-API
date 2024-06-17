import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVisitDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  place_id: string;

  @IsNotEmpty()
  @IsDateString()
  visit_date: Date;

  @IsNotEmpty()
  @IsNumber()
  points_awarded: number;
}
