import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { BuisnessStructureService } from '../services/buisness-structure.service.js';
import { CreateBuisnessStructureDto, UpdateBuisnessStructureDto } from '../dtos/buisness-structure.dto.js';

@Controller('lov/buisness-structures')
export class BuisnessStructureController {
  constructor(private readonly service: BuisnessStructureService) {}

  @Post()
  create(@Body() dto: CreateBuisnessStructureDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBuisnessStructureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
