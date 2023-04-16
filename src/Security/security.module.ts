import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { useCases } from './useCases';
import { EmailService } from './email';
import { HardJwtAuthStrategy } from '../Base';
import { appConfig } from '../Infrastructure';
import { AuthController } from './controllers';
import { RefreshJwtAuthStrategy } from './strategy';
import { AuthCommandRepository, AuthQueryRepository } from './repos';

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
    HardJwtAuthStrategy,
    RefreshJwtAuthStrategy,
    ...useCases,
  ],
})
export class SecurityModule {}
