import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { RegisterUserDto } from '../dto/UserDto';
import { UpdateCountryDto } from '../dto/UpdateCountryDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { user_id: id } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find Email');
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
      throw new ConflictException('User already exists');
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

  async updateCountry(
    user_id: number,
    updateCountryDto: UpdateCountryDto,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    user.country = updateCountryDto.country;
    return this.usersRepository.save(user);
  }
}
