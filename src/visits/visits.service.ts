import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateVisitDto } from './CreateVisitDto';
import { Visit } from './visits.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { UsersService } from '../users/users.service';
import { PlacesService } from '../places/places.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    private readonly userService: UsersService,
    private readonly placeService: PlacesService,
  ) {}

  async validateCreateVisitDto(
    createVisitDto: CreateVisitDto,
  ): Promise<CreateVisitDto> {
    const errors = await validate(createVisitDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return createVisitDto;
  }

  async createVisit(createVisitDto: CreateVisitDto): Promise<Visit> {
    const { user_id, placeId } = createVisitDto;

    const user = await this.userService.findById(user_id);
    const place = await this.placeService.findById(placeId);

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }
    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const existingVisit = await this.visitRepository.findOne({
      where: { user: { user_id }, place: { place_id: placeId } },
    });

    if (existingVisit) {
      throw new ConflictException(`You have already claimed this reward`);
    }

    const newVisit = new Visit();
    newVisit.user = user;
    newVisit.place = place;

    return this.visitRepository.save(newVisit);
  }

  async getVisitsByUser(userId: number): Promise<Partial<Visit>[]> {
    const visits = await this.visitRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user', 'place'],
    });

    // Manually exclude the `user` field from each visit
    return visits.map(visit => {
      const { user, ...visitWithoutUser } = visit;
      return visitWithoutUser;
    });
  }
}
