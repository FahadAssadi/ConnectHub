import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service.js';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto.js';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.service.findByStatus(status);
  }

  @Get('company/:companyProfileId')
  findByCompanyProfile(@Param('companyProfileId') companyProfileId: string) {
    return this.service.findByCompanyProfile(companyProfileId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
