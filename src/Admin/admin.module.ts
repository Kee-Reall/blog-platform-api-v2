import { Module } from '@nestjs/common';
import { BasicAuthGuard } from './guards';
import { AdminUsersController } from './controllers';

@Module({
  imports: [],
  controllers: [AdminUsersController],
  providers: [BasicAuthGuard],
})
export class AdminModule {}
