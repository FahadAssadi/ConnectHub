import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ProductController } from './controllers/product.controller.js';
import { EOIController } from './controllers/eoi.controller.js';
import { ProductService } from './services/product.service.js';
import { EOIService } from './services/eoi.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController, EOIController],
  providers: [ProductService, EOIService],
  exports: [ProductService, EOIService],
})
export class ProductModule {}
