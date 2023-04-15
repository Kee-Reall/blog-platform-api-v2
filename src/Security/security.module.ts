import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './controllers/auth.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from '../Infrastructure';

@Module({
  imports: [CqrsModule, ThrottlerModule.forRoot(appConfig.throttlerOptions)],
  controllers: [AuthController],
  providers: [],
})
export class SecurityModule {}
