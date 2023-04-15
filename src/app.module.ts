import { Module } from '@nestjs/common';
import { TestingModule } from './Testing/testing.module';
import { SecurityModule } from './Security/security.module';
import { AdminModule } from './Admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig } from './Infrastructure';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(appConfig.dbOptions),
    MailerModule.forRoot(appConfig.mailOptions),
    TestingModule,
    SecurityModule,
    AdminModule,
  ],
})
export class AppModule {}
