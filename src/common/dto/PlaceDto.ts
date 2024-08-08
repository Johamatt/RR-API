import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Point, Polygon, LineString } from 'geojson';
import { AddressDto } from './AddressDto';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  public place_id: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Point)
  public point_coordinates?: Point;

  @IsOptional()
  @ValidateNested()
  @Type(() => Polygon)
  public polygon_coordinates?: Polygon;

  @IsOptional()
  @ValidateNested()
  @Type(() => LineString)
  public linestring_coordinates?: LineString;

  @IsString()
  @IsNotEmpty()
  public name_fi: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkatyyppi: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkatyypinalaryhmä: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkatyypinpääryhmä: string;

  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto;

  @IsString()
  @IsOptional()
  public www?: string;

  @IsString()
  @IsOptional()
  public lisätieto?: string;

  @IsString()
  @IsOptional()
  public muokattu_viimeksi?: string;

  @IsString()
  @IsOptional()
  public puhelinnumero?: string;

  @IsString()
  @IsOptional()
  public markkinointinimi?: string;

  @IsOptional()
  public sähköposti?: string;
}
