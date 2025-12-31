import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CertificationService } from '../services/certification.service.js';
import { CreateCertificationDto, UpdateCertificationDto } from '../dtos/certification.dto.js';

@Controller('lov/certifications')
export class CertificationController {
  constructor(private readonly service: CertificationService) {}

  @Post()
  create(@Body() dto: CreateCertificationDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCertificationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
