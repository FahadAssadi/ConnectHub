import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { IndustryCategoryService } from '../services/industry-category.service.js';
import { CreateIndustryCategoryDto, UpdateIndustryCategoryDto } from '../dtos/industry-category.dto.js';

@Controller('lov/industry-categories')
export class IndustryCategoryController {
  constructor(private readonly service: IndustryCategoryService) {}

  @Post()
  create(@Body() dto: CreateIndustryCategoryDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateIndustryCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
