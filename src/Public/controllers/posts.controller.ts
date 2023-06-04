import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { query } from '../useCases';
//import { CommentInput, LikeInput } from '../validators';
import { Meta, SoftJwtGuard } from '../../Base';
import { IPaginationConfig, SoftGuardMeta } from '../../Model';
import { PublicPostsPaginationPipe } from '../pipes';

@Controller('posts')
export class PostsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get()
  @UseGuards(SoftJwtGuard)
  public async getPosts(
    @Query(PublicPostsPaginationPipe) filter: IPaginationConfig,
    @Meta() meta: SoftGuardMeta,
  ) {
    return this.queryBus.execute(new query.GetPosts(meta.userId, filter));
  }

  @Get(':id')
  @UseGuards(SoftJwtGuard)
  public async getPost(
    @Param('id') postId: string,
    @Meta() meta: SoftGuardMeta,
  ) {
    return await this.queryBus.execute(new query.GetPost(postId, meta.userId));
  }

  // @Get(':id/comments')
  // @UseGuards(SoftJwtGuard)
  // public async getComments(
  //   @Param('id') postId: string,
  //   @Meta() meta: AccessTokenMeta,
  //   @Query() filter: CommentsFilter,
  // ) {
  //   // return await this.queryBus.execute(
  //   //   new query.GetComments(meta.userId, postId, filter),
  //   // );
  // }
  //
  // @Post(':id/comments')
  // @UseGuards(JwtGuard)
  // public async createComment(
  //   @Meta() meta: AccessTokenMeta,
  //   @Body() dto: CommentInput,
  //   @Param('id') postId: string,
  // ) {
  //   return await this.commandBus.execute(
  //     new command.CreateComment(meta.userId, postId, dto.content),
  //   );
  // }

  // @Put(':id/like-status')
  // @UseGuards(JwtGuard)
  // public async likePost(
  //   @Meta() meta: AccessTokenMeta,
  //   @Param('id') postId: string,
  //   @Body() dto: LikeInput,
  // ) {
  //   return await this.commandBus.execute(
  //     new command.LikePost(meta.userId, postId, dto.likeStatus),
  //   );
  // }
}
