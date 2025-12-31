import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateBusinessStructureDto, UpdateBusinessStructureDto } from '../dtos/buisness-structure.dto.js';

@Injectable()
export class BusinessStructureService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBusinessStructureDto) {
    return this.db.businessStructure.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.businessStructure.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.businessStructure.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateBusinessStructureDto) {
    return this.db.businessStructure.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async delete(id: string) {
    return this.db.businessStructure.delete({
      where: { id },
    });
  }
}
