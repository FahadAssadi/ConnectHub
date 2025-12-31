import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { ProductController } from './controllers/product.controller.js';
import { ProductService } from './services/product.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
