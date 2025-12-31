import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateIndustrySpecialisationDto, UpdateIndustrySpecialisationDto } from '../dtos/industry-specialisation.dto.js';

@Injectable()
export class IndustrySpecialisationService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateIndustrySpecialisationDto) {
    return this.db.industrySpecialisation.create({
      data: { name: dto.name, subCategoryId: dto.subCategoryId },
    });
  }

  async findAll() {
    return this.db.industrySpecialisation.findMany({
      include: { subCategory: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySubCategory(subCategoryId: string) {
    return this.db.industrySpecialisation.findMany({
      where: { subCategoryId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.industrySpecialisation.findUnique({
      where: { id },
      include: { subCategory: { include: { category: true } } },
    });
  }

  async update(id: string, dto: UpdateIndustrySpecialisationDto) {
    return this.db.industrySpecialisation.update({
      where: { id },
      data: { name: dto.name, subCategoryId: dto.subCategoryId },
    });
  }

  async delete(id: string) {
    return this.db.industrySpecialisation.delete({
      where: { id },
    });
  }
}
