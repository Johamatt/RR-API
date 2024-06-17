import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { RegisterUserDto } from 'src/dto/UserDto';
import { ErrorDto } from 'src/dto/ErrorDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      const errorMessage: ErrorDto = {
        message: ['Failed to find Email'],
        error: HttpStatus.INTERNAL_SERVER_ERROR,
        statusCode: 400,
      };
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async createGoogleUser(googleId: string, email: string): Promise<User> {
    const user = this.usersRepository.create({ googleId, email });
    return this.usersRepository.save(user);
  }

  async createUser(createUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      const errorMessage: ErrorDto = {
        message: ['User already exists'],
        error: HttpStatus.CONFLICT,
        statusCode: 400,
      };
      throw new ConflictException(errorMessage);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        const errorMessage: ErrorDto = {
          message: ['User not found or invalid credentials'],
          error: HttpStatus.BAD_REQUEST,
          statusCode: HttpStatus.BAD_REQUEST,
        };
        throw new BadRequestException(errorMessage);
      }

      const passwordMatch = await compare(password, user.password);
      if (passwordMatch) {
        return user;
      } else {
        const errorMessage: ErrorDto = {
          message: ['User not found or invalid credentials'],
          error: HttpStatus.UNAUTHORIZED,
          statusCode: HttpStatus.UNAUTHORIZED,
        };
        throw new UnauthorizedException(errorMessage);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        const errorMessage: ErrorDto = {
          message: ['Internal server error'],
          error: HttpStatus.INTERNAL_SERVER_ERROR,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
        throw new InternalServerErrorException(errorMessage);
      }
    }
  }
}
