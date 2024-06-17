import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'src/users/users.entity';
import { LoginUserDto, RegisterUserDto } from '../dto/UserDto';
import { ErrorDto } from '../dto/ErrorDto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('google')
  async authenticate(
    @Body('idToken') idToken: string,
  ): Promise<{ message: string; user: User }> {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token');
    }

    const { sub: googleId, email } = payload;

    let user = await this.usersService.findOneByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createGoogleUser(googleId, email);
      return { message: 'User created', user };
    }

    return { message: 'Success', user };
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { email } = body;

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createUser(body);
      return { message: 'User created', user };
    }
    if (user) {
      const errorMessage: ErrorDto = {
        message: ['User with given email already exists'],
        error: HttpStatus.CONFLICT,
        statusCode: 400,
      };
      throw new ConflictException(errorMessage);
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;

    let user = await this.usersService.findByEmailAndPassword(email, password);

    return { message: 'Logged in', user };
  }
}
