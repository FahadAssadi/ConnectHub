import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth.js';
import { AppAuthModule } from './auth/auth.module.js';

@Module({
  imports: [DatabaseModule, AuthModule.forRoot({ auth }), AppAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
