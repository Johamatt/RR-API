import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { User } from '../users/users.entity';
import { EmailAuthRequest } from '../common/dto/EmailAuthRequest';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async authenticate(
    @Body('idToken') idToken: string,
  ): Promise<{ message: string; user: User; jwtToken?: string }> {
    const payload = await this.authService.verifyGoogleToken(idToken);

    const { sub: googleId, email } = payload;
    let user = await this.authService.findOneByGoogleId(googleId);

    if (!user) {
      user = await this.authService.createGoogleUser(googleId, email);
    }

    const { jwtToken } = await this.authService.login(user);
    return { message: user ? 'Success' : 'User created', user, jwtToken };
  }

  @Post('register')
  async register(@Body() body: EmailAuthRequest) {
    let user = await this.authService.findByEmail(body.email);
    user = await this.authService.createEmailUser(body);
    const { jwtToken } = await this.authService.login(user);
    return { message: 'User created', user, jwtToken };
  }

  @Post('login')
  async login(@Body() body: EmailAuthRequest) {
    const { email, password } = body;
    const user = await this.authService.findByEmailAndPassword(email, password);
    const { jwtToken } = await this.authService.login(user);
    return { message: 'Logged in', user, jwtToken };
  }

  @Get('validate-token')
  async validateToken(
    @Headers('Authorization') authHeader: string,
  ): Promise<Boolean> {
    console.log(authHeader);
    const token = authHeader.split(' ')[1];

    return await this.authService.verifyToken(token);
  }
}
