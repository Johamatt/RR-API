import { Injectable, BadRequestException } from '@nestjs/common';
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
    const newVisit = new Visit();
    const user = await this.userService.findById(createVisitDto.user_id);
    const place = await this.placeService.findById(createVisitDto.placeId);

    if (!user) {
      throw new BadRequestException(
        `User with ID ${createVisitDto.user_id} not found`,
      );
    }
    if (!place) {
      throw new BadRequestException(
        `Place with ID ${createVisitDto.placeId} not found`,
      );
    }
    newVisit.user = user;
    newVisit.place = place;
    newVisit.visit_date = new Date(createVisitDto.visit_date);
    newVisit.points_awarded = createVisitDto.points_awarded;
    return this.visitRepository.save(newVisit);
  }
}
