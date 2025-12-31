import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { EngagementModelService } from '../services/engagement-model.service.js';
import { CreateEngagementModelDto, UpdateEngagementModelDto } from '../dtos/engagement-model.dto.js';

@Controller('lov/engagement-models')
export class EngagementModelController {
  constructor(private readonly service: EngagementModelService) {}

  @Post()
  create(@Body() dto: CreateEngagementModelDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEngagementModelDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
