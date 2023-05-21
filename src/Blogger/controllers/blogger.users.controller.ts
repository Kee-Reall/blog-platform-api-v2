import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard, Meta } from '../../Base';
import { bloggerCommands } from '../useCases';
import { BunUserForBlogInput } from '../validators';
import {
  AccessTokenMeta,
  UsersForBloggerFilter,
  VoidPromise,
} from '../../Model';

@Controller('api/blogger/users')
@UseGuards(JwtGuard)
export class BloggerUsersController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('blog/:id')
  @HttpCode(HttpStatus.OK)
  public async getBannedUsers(
    @Param('id') blogId: string,
    @Meta('userId') userId: string,
    @Query() filter: UsersForBloggerFilter,
  ) /*: Promise<PaginatedOutput<UserForBloggerPresentation>>*/ {
    return;
    // return this.queryBus.execute(
    //   new bloggerQueries.GetBannedUsers(userId, blogId, filter),
    // );
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async banUserForBlog(
    @Param('id') userId: string,
    @Body() dto: BunUserForBlogInput,
    @Meta() meta: AccessTokenMeta,
  ): VoidPromise {
    return this.commandBus.execute(
      new bloggerCommands.BanUserForBlog(meta.userId, userId, dto),
    );
  }
}
