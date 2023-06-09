import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './Infrastructure';
import { GlobalHTTPFilter } from './Base';
import { callback } from './Helpers/';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(appConfig.globalValidatorOptions));
  app.useGlobalFilters(new GlobalHTTPFilter());
  app.setGlobalPrefix('api');
  const port = appConfig.port;
  await app.listen(port, callback(port));
}

bootstrap();
