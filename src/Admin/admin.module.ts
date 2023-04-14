import { Module } from '@nestjs/common';
import { BasicAuthGuard } from './guards';
import { AdminUsersController } from './controllers';
import { AdminQueryRepository } from './repos/admin-query.repository';
import { CreateUserUseCase } from './useCases/commands/create.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCommandRepository } from './repos/admin-command.repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([])],
  controllers: [AdminUsersController],
  providers: [
    BasicAuthGuard,
    AdminCommandRepository,
    AdminQueryRepository,
    CreateUserUseCase,
  ],
})
export class AdminModule {}
