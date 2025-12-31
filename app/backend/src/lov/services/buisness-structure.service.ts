import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateBuisnessStructureDto, UpdateBuisnessStructureDto } from '../dtos/buisness-structure.dto.js';

@Injectable()
export class BuisnessStructureService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBuisnessStructureDto) {
    return this.db.buisnessStructure.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.buisnessStructure.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.buisnessStructure.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateBuisnessStructureDto) {
    return this.db.buisnessStructure.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async delete(id: string) {
    return this.db.buisnessStructure.delete({
      where: { id },
    });
  }
}
