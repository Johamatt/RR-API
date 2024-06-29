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
import { ErrorDto } from '../dto/ErrorDto';

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
    const { user_id, placeId, points_awarded } = createVisitDto;

    const user = await this.userService.findById(user_id);
    const place = await this.placeService.findById(placeId);

    if (!user) {
      const errorMessage: ErrorDto = {
        message: [`User with ID ${user_id} not found`],
        error: HttpStatus.NOT_FOUND,
        statusCode: 404,
      };
      throw new NotFoundException(errorMessage);
    }
    if (!place) {
      const errorMessage: ErrorDto = {
        message: [`Place with ID ${placeId} not found`],
        error: HttpStatus.NOT_FOUND,
        statusCode: 404,
      };
      throw new NotFoundException(errorMessage);
    }

    const existingVisit = await this.visitRepository.findOne({
      where: { user: { user_id }, place: { place_id: placeId } },
    });

    if (existingVisit) {
      const errorMessage: ErrorDto = {
        message: [`You have already claimed this reward`],
        error: HttpStatus.CONFLICT,
        statusCode: 400,
      };

      throw new ConflictException(errorMessage);
    }

    const newVisit = new Visit();
    newVisit.user = user;
    newVisit.place = place;
    newVisit.points_awarded = points_awarded;

    return this.visitRepository.save(newVisit);
  }
}
