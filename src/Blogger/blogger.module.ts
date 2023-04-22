import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HardJwtAuthStrategy } from '../Base';
import { BloggerBlogsController } from './controllers';
import { BloggerCommandRepository, BloggerQueryRepository } from './repos';
import { useCasesHandlers } from './useCases';

@Module({
  imports: [CqrsModule],
  controllers: [BloggerBlogsController],
  providers: [
    BloggerQueryRepository,
    BloggerCommandRepository,
    HardJwtAuthStrategy,
    ...useCasesHandlers,
  ],
})
export class BloggerModule {}
