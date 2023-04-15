import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useCases } from './useCases';
import { BasicAuthGuard } from './guards';
import { AdminUsersController } from './controllers';
import { AdminQueryRepository, AdminCommandRepository } from './repos/';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([])],
  controllers: [AdminUsersController],
  providers: [
    BasicAuthGuard,
    AdminCommandRepository,
    AdminQueryRepository,
    ...useCases,
  ],
})
export class AdminModule {}
