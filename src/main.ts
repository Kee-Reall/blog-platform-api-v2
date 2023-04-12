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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(cookie, { secret: 'pohkakoysecret' });
  app.useGlobalPipes(new ValidationPipe(appConfig.globalValidatorOptions));
  app.useGlobalFilters(new GlobalHTTPFilter());
  const port = 3000;
  await app.listen(port, () =>
    console.log('Api is listening :' + port + ' port'),
  );
}

bootstrap();
