import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './controllers/auth.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from '../Infrastructure';
import { useCases } from './useCases';
import { AuthCommandRepository, AuthQueryRepository } from './repos';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    ThrottlerModule.forRoot(appConfig.throttlerOptions),
  ],
  controllers: [AuthController],
  providers: [
    EmailService,
    AuthQueryRepository,
    AuthCommandRepository,
    ...useCases,
  ],
})
export class SecurityModule {}
