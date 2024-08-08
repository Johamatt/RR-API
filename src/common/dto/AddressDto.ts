import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  public katuosoite: string;

  @IsString()
  @IsNotEmpty()
  public postinumero: string;

  @IsString()
  @IsNotEmpty()
  public kunta: string;

  @IsString()
  @IsOptional()
  public kuntaosa?: string;

  @IsString()
  @IsOptional()
  public postitoimipaikka?: string;

  @IsString()
  @IsOptional()
  public maakunta?: string;
}
