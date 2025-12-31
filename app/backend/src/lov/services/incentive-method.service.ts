import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateIncentiveMethodDto, UpdateIncentiveMethodDto } from '../dtos/incentive-method.dto.js';

@Injectable()
export class IncentiveMethodService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateIncentiveMethodDto) {
    return this.db.incentiveMethod.create({
      data: { name: dto.name, description: dto.description },
    });
  }

  async findAll() {
    return this.db.incentiveMethod.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.incentiveMethod.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateIncentiveMethodDto) {
    return this.db.incentiveMethod.update({
      where: { id },
      data: { name: dto.name, description: dto.description },
    });
  }

  async delete(id: string) {
    return this.db.incentiveMethod.delete({
      where: { id },
    });
  }
}
