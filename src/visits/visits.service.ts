import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './visits.entity';
import { CreateVisitDto } from './CreateVisitDto';
import { Place } from '../places/places.entity';
import { User } from '../users/users.entity';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  public async createVisit(createVisitDto: CreateVisitDto): Promise<Visit> {
    const user = await this.userRepository.findOne({
      where: { user_id: createVisitDto.user_id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const place = await this.placeRepository.findOne({
      where: { place_id: createVisitDto.place_id },
    });
    if (!place) {
      throw new NotFoundException('Place not found');
    }

    const visit = this.visitRepository.create({
      ...createVisitDto,
      user,
      place,
    });

    return this.visitRepository.save(visit);
  }

  public async findAll(): Promise<Visit[]> {
    return this.visitRepository.find({ relations: ['user', 'place'] });
  }

  public async findOne(id: number): Promise<Visit> {
    const visit = await this.visitRepository.findOne({
      where: { visit_id: id },
      relations: ['user', 'place'],
    });
    if (!visit) {
      throw new NotFoundException('Visit not found');
    }
    return visit;
  }

  public async remove(id: number): Promise<void> {
    const result = await this.visitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Visit not found');
    }
  }
}
