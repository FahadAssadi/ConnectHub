import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
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
