import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailAuthRequest {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
