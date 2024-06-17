import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

export class ErrorDto {
  @IsEmail()
  @IsNotEmpty()
  public message: Array<string>;

  @IsEnum(HttpStatus)
  public error: string | HttpStatus;

  @IsString()
  @IsNotEmpty()
  public statusCode: number;
}
