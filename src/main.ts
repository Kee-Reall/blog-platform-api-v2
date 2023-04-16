import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './Infrastructure';
import { GlobalHTTPFilter } from './Base';
import { callback } from './Helpers/';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(cookie, { secret: appConfig.cookieSecret });
  app.useGlobalPipes(new ValidationPipe(appConfig.globalValidatorOptions));
  app.useGlobalFilters(new GlobalHTTPFilter());
  app.setGlobalPrefix('api');
  const port = appConfig.port;
  await app.listen(port, callback(port));
}

bootstrap();
