import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateIndustryCategoryDto, UpdateIndustryCategoryDto } from '../dtos/industry-category.dto.js';

@Injectable()
export class IndustryCategoryService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateIndustryCategoryDto) {
    return this.db.industryCategory.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.industryCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.industryCategory.findUnique({
      where: { id },
      include: { industrySubCategories: true },
    });
  }

  async update(id: string, dto: UpdateIndustryCategoryDto) {
    return this.db.industryCategory.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async delete(id: string) {
    return this.db.industryCategory.delete({
      where: { id },
    });
  }
}
