import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BusinessStructureService } from '../services/buisness-structure.service.js';
import { CreateBusinessStructureDto, UpdateBusinessStructureDto } from '../dtos/buisness-structure.dto.js';

@Controller('lov/buisness-structures')
export class BusinessStructureController {
  constructor(private readonly service: BusinessStructureService) {}

  @Post()
  create(@Body() dto: CreateBusinessStructureDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBusinessStructureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
