import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { setupSwagger } from './config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Security
  app.use(helmet());
  app.enableCors({
    origin: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });

  // 🛠 Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ các field thừa
      forbidNonWhitelisted: true, // chặn field lạ
      transform: true, // tự cast DTO
    }),
  );

  // 📝 Logger
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;

  // Swagger
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 8000);
  logger.log(`🚀 Server is running on http://localhost:${port}`);
  logger.log(`📑 Swagger Docs: http://localhost:${port}/api/docs`);
}
void bootstrap();
