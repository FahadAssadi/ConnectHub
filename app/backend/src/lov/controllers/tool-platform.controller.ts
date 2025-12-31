import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ToolPlatformService } from '../services/tool-platform.service.js';
import { CreateToolPlatformDto, UpdateToolPlatformDto } from '../dtos/tool-platform.dto.js';

@Controller('lov/tool-platforms')
export class ToolPlatformController {
  constructor(private readonly service: ToolPlatformService) {}

  @Post()
  create(@Body() dto: CreateToolPlatformDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateToolPlatformDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
