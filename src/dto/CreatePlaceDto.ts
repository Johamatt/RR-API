import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Point, Polygon, LineString } from 'geojson';

export class CreatePlaceDto {
  @IsNumber()
  @IsNotEmpty()
  public placeId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Point)
  public pointCoordinates?: Point;

  @IsOptional()
  @ValidateNested()
  @Type(() => Polygon)
  public polygonCoordinates?: Polygon;

  @IsOptional()
  @ValidateNested()
  @Type(() => LineString)
  public linestringCoordinates?: LineString;

  @IsString()
  @IsNotEmpty()
  public nameFi: string;

  @IsString()
  @IsNotEmpty()
  public country: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkaTyyppi: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkatyypinAlaryhmä: string;

  @IsString()
  @IsNotEmpty()
  public liikuntapaikkatyypinPääryhmä: string;

  @IsString()
  @IsNotEmpty()
  public katuosoite: string;

  @IsString()
  @IsNotEmpty()
  public postinumero: string;

  @IsString()
  @IsOptional()
  public www?: string;

  @IsString()
  @IsOptional()
  public kunta?: string;

  @IsString()
  @IsOptional()
  public kuntaosa?: string;

  @IsNumber()
  @IsOptional()
  public liikuntapintaalaM2?: number;

  @IsString()
  @IsOptional()
  public postitoimipaikka?: string;

  @IsString()
  @IsOptional()
  public lisätieto?: string;

  @IsString()
  @IsOptional()
  public muokattuViimeksi?: string;

  @IsNumber()
  @IsOptional()
  public kentänLeveysM?: number;

  @IsNumber()
  @IsOptional()
  public kentänPituusM?: number;

  @IsString()
  @IsOptional()
  public puhelinnumero?: string;

  @IsString()
  @IsOptional()
  public pintamateriaaliLisätieto?: string;

  @IsString()
  @IsOptional()
  public markkinointinimi?: string;

  @IsString()
  @IsOptional()
  public omistaja?: string;

  @IsString()
  @IsOptional()
  public maakunta?: string;

  @IsString()
  @IsOptional()
  public pintamateriaali?: string;

  @IsEmail()
  @IsOptional()
  public sähköposti?: string;

  @IsString()
  @IsOptional()
  public peruskorjausvuodet?: string;

  @IsString()
  @IsOptional()
  public aviAlue?: string;
}
