import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModel, BlogWithExtended, VoidPromise } from '../../../Model';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { BloggerService } from './blogger.service';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';

export class UpdateBlog implements BlogInputModel {
  description: string;

  name: string;
  websiteUrl: string;
  public userId: number;
  public blogId: number;
  constructor(
    userId: string | number,
    blogId: string,

    dto: BlogInputModel,
  ) {
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
    this.name = dto.name;
    this.blogId = +blogId;
    this.userId = +userId;
  }
}

@CommandHandler(UpdateBlog)
export class UpdateBlogUseCase
  extends BloggerService
  implements ICommandHandler<UpdateBlog>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: UpdateBlog): VoidPromise {
    const blog: BlogWithExtended = await this.queryRepo.getBlogByIdWIthMeta(
      command.blogId,
    );
    if (!blog) {
      throw new NotFoundException();
    }
    const extended = blog.extendedInfo;
    const isBanned = extended.isBlogBanned || extended.isOwnerBanned;
    const isDeleted = extended.isOwnerDeleted || extended.isDeleted;
    if (isBanned || isDeleted) {
      throw new NotFoundException();
    }
    if (extended.ownerId !== command.userId) {
      throw new ForbiddenException();
    }
    const updated = await this.commandRepo.updateBlog(
      blog.id,
      <BlogInputModel>command,
    );
    if (!updated) {
      throw new ImATeapotException();
    }
    return;
  }
}
