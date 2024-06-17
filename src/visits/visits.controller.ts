import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './CreateVisitDto';
import { Visit } from './visits.entity';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  public create(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    return this.visitsService.createVisit(createVisitDto);
  }

  @Get()
  public findAll(): Promise<Visit[]> {
    return this.visitsService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: number): Promise<Visit> {
    return this.visitsService.findOne(id);
  }

  @Delete(':id')
  public remove(@Param('id') id: number): Promise<void> {
    return this.visitsService.remove(id);
  }
}
