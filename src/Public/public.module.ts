import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import {
  BlogsController,
  CommentsController,
  PostsController,
} from './controllers';
import { PublicQueryRepository } from './repos/query.repository';

@Module({
  imports: [CqrsModule, JwtModule.register({})],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [PublicQueryRepository],
})
export class PublicModule {}
