import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateVisitDto } from './CreateVisitDto';
import { Visit } from './visits.entity';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    const validatedDto =
      await this.visitsService.validateCreateVisitDto(createVisitDto);
    return this.visitsService.createVisit(validatedDto);
  }
}
