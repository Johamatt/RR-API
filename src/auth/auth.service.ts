import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/dto/UserDto';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly oauth2Client: OAuth2Client,
  ) {}

  async verifyToken(token: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException();
    }
    return payload;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.user_id };
    return {
      jwtToken: this.jwtService.sign(payload),
    };
  }

  async createGoogleUser(googleId: string, email: string): Promise<User> {
    const user = this.usersRepository.create({ googleId, email });
    return this.usersRepository.save(user);
  }

  async createEmailUser(createUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find Email');
    }
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        throw new BadRequestException('User not found or invalid credentials');
      }

      const passwordMatch = await compare(password, user.password);
      if (passwordMatch) {
        return user;
      } else {
        throw new UnauthorizedException(
          'User not found or invalid credentials',
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
}
