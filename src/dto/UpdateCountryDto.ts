import { IsNumber, IsString } from 'class-validator';

export class UpdateCountryDto {
  @IsNumber()
  user_id: number;

  @IsString()
  country: string;
}
