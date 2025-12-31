import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });

  // Enable CORS BEFORE mounting Better Auth handler
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Mount Better Auth handler directly on Express instance
  const express = app.getHttpAdapter().getInstance();
  express.all(/^\/api\/auth\/.*$/, toNodeHandler(auth));

  // Log all HTTP requests
  app.use((req: Request, res: Response, next: NextFunction): void => {
    const logger = new Logger('HTTP');
    logger.log(`${req.method} ${req.url}`);
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('ConnectHub API')
    .setDescription('The ConnectHub API documentation')
    .setVersion('1.0')
    .addTag('connecthub')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('info', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
