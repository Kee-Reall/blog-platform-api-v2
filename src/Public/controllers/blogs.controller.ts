import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { query } from '../useCases';
import { Meta, SoftJwtGuard } from '../../Base';
import { PublicBlogsPaginationPipe, PublicPostsPaginationPipe } from '../pipes';
import {
  BlogPresentationModel,
  IBlogPaginationConfig,
  IPaginationConfig,
  PaginatedOutput,
  PostPresentationModel,
  SoftGuardMeta,
  WithExtendedLike,
} from '../../Model';

@Controller('blogs')
export class BlogsController {
  constructor(private bus: QueryBus) {}
  @Get()
  public async getBlogs(
    @Query(PublicBlogsPaginationPipe) filters: IBlogPaginationConfig,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    console.log(filters);
    return await this.bus.execute(new query.GetBlogs(filters));
  }
  @Get(':id')
  public async getBlogById(
    @Param('id') blogId: string,
  ): Promise<BlogPresentationModel> {
    console.log('work');
    return await this.bus.execute(new query.GetBlog(blogId));
  }
  @Get(':id/posts')
  @UseGuards(SoftJwtGuard)
  public async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query(PublicPostsPaginationPipe) filters: IPaginationConfig,
    @Meta() meta: SoftGuardMeta,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    return await this.bus.execute(
      new query.GetPostsByBlog(meta.userId, blogId, filters),
    );
  }
}
