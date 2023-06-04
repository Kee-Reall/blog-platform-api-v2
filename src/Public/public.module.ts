import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { BlogsController, PostsController } from './controllers';
import { useCases } from './useCases';
import { repos } from './repos';
import { paginate, PAGINATE_FUNC } from '../Base/helpers/paginate.function';

@Module({
  imports: [CqrsModule, JwtModule.register({})],
  controllers: [BlogsController, PostsController],
  providers: [
    ...repos,
    ...useCases,
    { provide: PAGINATE_FUNC, useValue: paginate },
  ],
})
export class PublicModule {}
