import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerService } from './blogger.service';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import {
  BlogWithExtended,
  PostInputModel,
  PostPresentationModel,
  WithExtendedLike,
} from '../../../Model';
import {
  ForbiddenException,
  ImATeapotException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export class CreatePost implements PostInputModel {
  public content: string;
  public shortDescription: string;
  public title: string;

  constructor(
    public userId: string,
    public blogId: string,
    dto: PostInputModel,
  ) {
    this.content = dto.content;
    this.shortDescription = dto.shortDescription;
    this.title = dto.title;
  }
}

@CommandHandler(CreatePost)
export class CreatePostUseCase
  extends BloggerService
  implements ICommandHandler<CreatePost>
{
  private logger = new Logger(this.constructor.name);
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(
    command: CreatePost,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
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
    if (extended.ownerId.toString() !== command.userId) {
      throw new ForbiddenException();
    }
    const contract = await this.commandRepo.createPost(command);
    if (contract.isFailed()) {
      this.logger.debug('while saving');
      throw new ImATeapotException();
    }
    const post = await this.queryRepo.getPost(contract.getPayload());
    if (post.isFailed()) {
      this.logger.debug('while getting');
      throw new ImATeapotException();
    }
    return post.getPayload();
  }
}
