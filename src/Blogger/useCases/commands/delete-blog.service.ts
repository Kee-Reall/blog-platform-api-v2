import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BlogWithExtended, VoidPromise } from '../../../Model';
import { BloggerService } from './blogger.service';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';

export class DeleteBlog {
  constructor(public userId: number, public blogId: string) {}
}

@CommandHandler(DeleteBlog)
export class DeleteBlogUseCase
  extends BloggerService
  implements ICommandHandler<DeleteBlog>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: DeleteBlog): VoidPromise {
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
    await this.commandRepo.deleteBlogByBlogId(blog.id);
    return;
  }
}
