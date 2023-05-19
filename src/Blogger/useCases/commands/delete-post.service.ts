import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ForbiddenException,
  ImATeapotException,
  NotFoundException,
} from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class DeletePost {
  constructor(
    public userId: string | number,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePost)
export class DeletePostUseCase
  extends BloggerService
  implements ICommandHandler<DeletePost>
{
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }

  public async execute(command: DeletePost) {
    const post = await this.queryRepo.getPostByIdWIthMeta(command.postId);
    if (isNil(post)) {
      throw new NotFoundException();
    }
    if ((post.blogId as number).toString() !== command.blogId) {
      throw new NotFoundException();
    }
    const extended = post.extendedInfo;
    const isBanned = extended.isBlogBanned || extended.isBlogBanned;
    const isDeleted =
      extended.isDeleted || extended.isBlogDeleted || extended.isOwnerDeleted;
    if (isBanned || isDeleted) {
      throw new NotFoundException();
    }
    if (command.userId !== extended.ownerId) {
      throw new ForbiddenException();
    }
    const isSuccess = await this.commandRepo.deletePost(+command.postId);
    if (!isSuccess) {
      throw new ImATeapotException();
    }
    return;
  }
}
