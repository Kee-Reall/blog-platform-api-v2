import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import repositories from './repos';
import controllers from './controllers';
import useCasesHandlers from './useCases';
import { HardJwtAuthStrategy } from '../Base';
@Module({
  controllers,
  imports: [CqrsModule],
  providers: [HardJwtAuthStrategy, ...useCasesHandlers, ...repositories],
})
export class BloggerModule {}
