import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../users/users.entity';
import { LoginUserDto, RegisterUserDto } from '../dto/UserDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async authenticate(
    @Body('idToken') idToken: string,
  ): Promise<{ message: string; user: User; jwtToken?: string }> {
    const payload = await this.authService.verifyToken(idToken);

    const { sub: googleId, email } = payload;
    let user = await this.authService.findOneByGoogleId(googleId);

    if (!user) {
      user = await this.authService.createGoogleUser(googleId, email);
    }

    const { jwtToken } = await this.authService.login(user);
    return { message: user ? 'Success' : 'User created', user, jwtToken };
  }

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    let user = await this.authService.findByEmail(body.email);
    user = await this.authService.createEmailUser(body);
    const { jwtToken } = await this.authService.login(user);
    return { message: 'User created', user, jwtToken };
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;
    const user = await this.authService.findByEmailAndPassword(email, password);
    const { jwtToken } = await this.authService.login(user);
    return { message: 'Logged in', user, jwtToken };
  }
}
