import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Point } from 'geojson';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public place_id: string;

  public description: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Point)
  public coordinates: Point;

  @IsNotEmpty()
  @IsNumber()
  public points: number;

  @IsString()
  @IsNotEmpty()
  public country: string;
}
