import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckProximityDto {
  @IsNotEmpty()
  public userLatitude: number;

  @IsNotEmpty()
  public userLongitude: number;

  @IsNotEmpty()
  public markerLatitude: number;

  @IsNotEmpty()
  public markerLongitude: number;
}
