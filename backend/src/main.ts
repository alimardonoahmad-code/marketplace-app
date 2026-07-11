import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const uploadDir = join(process.cwd(), 'uploads', 'products');
  const reviewUploadDir = join(process.cwd(), 'uploads', 'reviews');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(reviewUploadDir)) {
    fs.mkdirSync(reviewUploadDir, { recursive: true });
  }

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  const isDev = configService.get('NODE_ENV') !== 'production';

  const allowedOrigins = (
    configService.get<string>('ALLOWED_ORIGINS') ||
    configService.get<string>('FRONTEND_URL', 'http://localhost:3000')
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: isDev
      ? true
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = configService.get<number>('PORT', 3001);
  const host = configService.get<string>('HOST', '0.0.0.0');
  await app.listen(port, host);
  console.log(`🚀 Marketplace API: http://localhost:${port}/api`);
  console.log(`   LAN: http://<IP-и-компютер>:${port}/api`);
}

bootstrap();
