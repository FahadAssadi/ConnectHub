import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateYearsOfExperienceDto, UpdateYearsOfExperienceDto } from '../dtos/years-of-experience.dto.js';

@Injectable()
export class YearsOfExperienceService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateYearsOfExperienceDto) {
    return this.db.yearsOfExperience.create({
      data: { range: dto.range },
    });
  }

  async findAll() {
    return this.db.yearsOfExperience.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.yearsOfExperience.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateYearsOfExperienceDto) {
    return this.db.yearsOfExperience.update({
      where: { id },
      data: { range: dto.range },
    });
  }

  async delete(id: string) {
    return this.db.yearsOfExperience.delete({
      where: { id },
    });
  }
}
