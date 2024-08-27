import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthRequest } from 'src/common/dto/EmailAuthRequest';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly oauth2Client: OAuth2Client,
  ) {}

  async verifyGoogleToken(token: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Invalid token');
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
    return { jwtToken: this.jwtService.sign(payload) };
  }

  async createGoogleUser(googleId: string, email: string): Promise<User> {
    const user = this.usersRepository.create({ googleId, email });
    return this.usersRepository.save(user);
  }

  async createEmailUser(createUser: EmailAuthRequest): Promise<User> {
    const { email, password } = createUser;
    const existingUser = await this.findByEmail(email);
    if (existingUser)
      throw new ConflictException('User with given email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
