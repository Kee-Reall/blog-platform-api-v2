import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PublicQueryRepository } from '../../repos';
import { BlogPresentationModel } from '../../../Model';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class GetBlog {
  constructor(public id: string) {}
}

@QueryHandler(GetBlog)
export class GetBlogUseCase implements IQueryHandler<GetBlog> {
  constructor(private repo: PublicQueryRepository) {}
  public async execute(query: GetBlog): Promise<BlogPresentationModel> {
    const blog = await this.repo.getBlogById(+query.id);
    if (isNil(blog)) {
      throw new NotFoundException();
    }
    const { extendedInfo, ...blogPresentation } = blog;
    const isDeleted = extendedInfo.isDeleted || extendedInfo.isOwnerDeleted;
    const isBanned = extendedInfo.isBlogBanned || extendedInfo.isOwnerBanned;
    if (isDeleted || isBanned) {
      throw new NotFoundException();
    }
    return blogPresentation;
  }
}
