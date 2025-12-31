import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateEngagementModelDto, UpdateEngagementModelDto } from '../dtos/engagement-model.dto.js';

@Injectable()
export class EngagementModelService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateEngagementModelDto) {
    return this.db.engagementModel.create({
      data: { name: dto.name, description: dto.description },
    });
  }

  async findAll() {
    return this.db.engagementModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.engagementModel.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateEngagementModelDto) {
    return this.db.engagementModel.update({
      where: { id },
      data: { name: dto.name, description: dto.description },
    });
  }

  async delete(id: string) {
    return this.db.engagementModel.delete({
      where: { id },
    });
  }
}
