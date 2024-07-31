import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../users/users.entity';
import { LoginUserDto, RegisterUserDto } from '../dto/UserDto';
import { AuthService } from './auth.service';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async authenticate(
    @Body('idToken') idToken: string,
  ): Promise<{ message: string; user: User; jwtToken?: string }> {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token');
    }

    const { sub: googleId, email } = payload;

    let user = await this.authService.findOneByGoogleId(googleId);

    if (!user) {
      user = await this.authService.createGoogleUser(googleId, email);
      const { jwtToken } = await this.authService.login(user);
      return { message: 'User created', user, jwtToken: jwtToken };
    }

    const { jwtToken } = await this.authService.login(user);
    return { message: 'Success', user, jwtToken: jwtToken };
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { email } = body;

    let user = await this.authService.findByEmail(email);

    if (!user) {
      user = await this.authService.createEmailUser(body);
      const jwtToken = await this.authService.login(user);
      return { message: 'User created', user, ...jwtToken };
    }
    if (user) {
      throw new ConflictException('User with given email already exists');
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;

    let user = await this.authService.findByEmailAndPassword(email, password);

    const jwtToken = await this.authService.login(user);
    return { message: 'Logged in', user, ...jwtToken };
  }
}
