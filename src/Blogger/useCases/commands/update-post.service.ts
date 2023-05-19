import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerService } from './blogger.service';
import { PostInputModel, VoidPromise } from '../../../Model';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import {
  ForbiddenException,
  ImATeapotException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class UpdatePost implements PostInputModel {
  content: string;
  shortDescription: string;
  title: string;

  constructor(
    public userId: string | number,
    public blogId: string,
    public postId: string,
    dto: PostInputModel,
  ) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
  }
}

@CommandHandler(UpdatePost)
export class UpdatePostUseCase
  extends BloggerService
  implements ICommandHandler<UpdatePost>
{
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(command: UpdatePost): VoidPromise {
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
    const isUpdated = await this.commandRepo.updatePost(
      +command.postId,
      command,
    );
    if (!isUpdated) {
      throw new ImATeapotException();
    }
    return;
  }
}
