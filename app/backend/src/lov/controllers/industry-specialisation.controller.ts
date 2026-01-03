import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { IndustrySpecialisationService } from '../services/industry-specialisation.service.js';
import { CreateIndustrySpecialisationDto, UpdateIndustrySpecialisationDto } from '../dtos/industry-specialisation.dto.js';

@Controller('lov/industry-specialisations')
export class IndustrySpecialisationController {
  constructor(private readonly service: IndustrySpecialisationService) {}

  @Post()
  create(@Body() dto: CreateIndustrySpecialisationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('subCategoryId') subCategoryId?: string) {
    if (subCategoryId) {
      return this.service.findBySubCategory(subCategoryId);
    }
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIndustrySpecialisationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
