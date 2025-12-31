import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { IncentiveMethodService } from '../services/incentive-method.service.js';
import { CreateIncentiveMethodDto, UpdateIncentiveMethodDto } from '../dtos/incentive-method.dto.js';

@Controller('lov/incentive-methods')
export class IncentiveMethodController {
  constructor(private readonly service: IncentiveMethodService) {}

  @Post()
  create(@Body() dto: CreateIncentiveMethodDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateIncentiveMethodDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
