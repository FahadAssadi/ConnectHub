import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service.js';
import { CreateCertificationDto, UpdateCertificationDto } from '../dtos/certification.dto.js';

@Injectable()
export class CertificationService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateCertificationDto) {
    return this.db.certification.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.db.certification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.db.certification.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateCertificationDto) {
    return this.db.certification.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async delete(id: string) {
    return this.db.certification.delete({
      where: { id },
    });
  }
}
