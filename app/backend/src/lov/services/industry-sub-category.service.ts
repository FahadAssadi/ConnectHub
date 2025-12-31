import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateIndustrySubCategoryDto, UpdateIndustrySubCategoryDto } from '../dtos/industry-sub-category.dto.js';

@Injectable()
export class IndustrySubCategoryService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateIndustrySubCategoryDto) {
    return this.db.industrySubCategory.create({
      data: { name: dto.name, categoryId: dto.categoryId },
    });
  }

  async findAll() {
    return this.db.industrySubCategory.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategoryId(categoryId: string) {
    return this.db.industrySubCategory.findMany({
      where: { categoryId },
      include: { industrySpecialisations: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateIndustrySubCategoryDto) {
    return this.db.industrySubCategory.update({
      where: { id },
      data: { name: dto.name, categoryId: dto.categoryId },
    });
  }

  async delete(id: string) {
    return this.db.industrySubCategory.delete({
      where: { id },
    });
  }
}
