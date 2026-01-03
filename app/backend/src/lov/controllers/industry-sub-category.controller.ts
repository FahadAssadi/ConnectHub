import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { IndustrySubCategoryService } from '../services/industry-sub-category.service.js';
import { CreateIndustrySubCategoryDto, UpdateIndustrySubCategoryDto } from '../dtos/industry-sub-category.dto.js';

@Controller('lov/industry-sub-categories')
export class IndustrySubCategoryController {
  constructor(private readonly service: IndustrySubCategoryService) {}

  @Post()
  create(@Body() dto: CreateIndustrySubCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findByCategoryId(@Param('id') id: string) {
    return this.service.findByCategoryId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIndustrySubCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
