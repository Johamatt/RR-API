import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  Get,
  Query,
} from '@nestjs/common';
import { CreateVisitDto } from './CreateVisitDto';
import { Visit } from './visits.entity';
import { VisitsService } from './visits.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createVisitDto: CreateVisitDto,
    @Request() req,
  ): Promise<Visit> {
    if (req.user.user_id !== createVisitDto.user_id) {
      throw new ForbiddenException('You can only edit your own user');
    }
    const validatedDto =
      await this.visitsService.validateCreateVisitDto(createVisitDto);
    return this.visitsService.createVisit(validatedDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getVisitsByUser(
    @Request() req,
    @Query('user_id') user_id: string,
  ): Promise<Partial<Visit>[]> {
    const userIdFromReq = String(req.user.user_id);
    if (userIdFromReq !== user_id) {
      throw new ForbiddenException('You can only edit your own user');
    }
    const userIdNumber = parseInt(user_id, 10);
    return this.visitsService.getVisitsByUser(userIdNumber);
  }
}
