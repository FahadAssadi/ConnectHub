import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { YearsOfExperienceService } from '../services/years-of-experience.service.js';
import { CreateYearsOfExperienceDto, UpdateYearsOfExperienceDto } from '../dtos/years-of-experience.dto.js';

@Controller('lov/years-of-experience')
export class YearsOfExperienceController {
  constructor(private readonly service: YearsOfExperienceService) {}

  @Post()
  create(@Body() dto: CreateYearsOfExperienceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateYearsOfExperienceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
