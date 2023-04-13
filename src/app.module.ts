import { Module } from '@nestjs/common';
import { TestingModule } from './Testing/testing.module';
import { SecurityModule } from './Security/security.module';
import { AdminModule } from './Admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './Infrastructure';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(appConfig.dbOptions),
    TestingModule,
    SecurityModule,
    AdminModule,
  ],
})
export class AppModule {}
