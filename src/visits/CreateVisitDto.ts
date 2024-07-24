import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateVisitDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  place_id: string;
}
