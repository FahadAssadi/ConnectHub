import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateToolPlatformDto, UpdateToolPlatformDto } from '../dtos/tool-platform.dto.js';

@Injectable()
export class ToolPlatformService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateToolPlatformDto) {
    return this.db.toolPlatform.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.toolPlatform.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.toolPlatform.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateToolPlatformDto) {
    return this.db.toolPlatform.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async delete(id: string) {
    return this.db.toolPlatform.delete({
      where: { id },
    });
  }
}
