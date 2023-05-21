import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { BlogsController } from './controllers';
import { useCases } from './useCases';
import { repos } from './repos';

@Module({
  imports: [CqrsModule, JwtModule.register({})],
  controllers: [BlogsController],
  providers: [...repos, ...useCases],
})
export class PublicModule {}
