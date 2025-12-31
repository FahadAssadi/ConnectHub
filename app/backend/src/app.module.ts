import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth.js';
import { AppAuthModule } from './auth/auth.module.js';
import { LovModule } from './lov/lov.module.js';
import { ProductModule } from './products/product.module.js';

@Module({
  imports: [DatabaseModule, AuthModule.forRoot({ auth }), AppAuthModule, LovModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
