import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateVisitDto } from './CreateVisitDto';
import { Visit } from './visits.entity';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  async create(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    try {
      const validatedDto =
        await this.visitsService.validateCreateVisitDto(createVisitDto);
      return this.visitsService.createVisit(validatedDto);
    } catch (error) {
      throw new BadRequestException({
        message: error,
        error: 'Bad Request',
        statusCode: 400,
      });
    }
  }
}
