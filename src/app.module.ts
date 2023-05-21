import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { appConfig } from './Infrastructure';
import { AdminModule } from './Admin/admin.module';
import { TestingModule } from './Testing/testing.module';
import { BloggerModule } from './Blogger/blogger.module';
import { SecurityModule } from './Security/security.module';
import { PublicModule } from './Public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(appConfig.dbOptions),
    MailerModule.forRoot(appConfig.mailOptions),
    TestingModule,
    SecurityModule,
    AdminModule,
    BloggerModule,
    PublicModule,
  ],
})
export class AppModule {}
