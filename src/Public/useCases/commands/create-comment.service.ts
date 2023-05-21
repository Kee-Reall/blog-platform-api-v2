import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PublicCommandRepository, PublicQueryRepository } from '../../repos';
import { CommentPresentationModel, LikesInfo, WithLike } from '../../../Model';

export class CreateComment {
  constructor(
    public userId: string,
    public postId: string,
    public content: string,
  ) {}
}

@CommandHandler(CreateComment)
export class CreateCommentUseCase implements ICommandHandler<CreateComment> {
  constructor(
    private queryRepo: PublicQueryRepository,
    private commandRepo: PublicCommandRepository,
  ) {}
  public async execute(
    command: CreateComment,
  ): Promise<WithLike<CommentPresentationModel>> {
    // const [post, user] = await Promise.all([
    //   this.queryRepo.getPostEntity(command.postId),
    //   this.queryRepo.getUserEntity(command.userId),
    // ]);
    // if (!post || !user) {
    //   throw new NotFoundException();
    // }
    // if (post._isBlogBanned) {
    //   throw new NotFoundException();
    // }
    // const ban: BanDocument = await this.queryRepo.getBanEntity(
    //   post.blogId,
    //   user._id,
    // );
    // if (ban && ban.isBanned) {
    //   throw new ForbiddenException();
    // }
    // const comment = new this.commentModel({
    //   postId: post._id,
    //   content: command.content,
    //   commentatorInfo: {
    //     userId: user._id,
    //     userLogin: user.login,
    //   },
    // });
    // const isSaved = await this.commandRepo.saveComment(comment);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    // return {
    //   ...(comment.toJSON() as CommentPresentationModel),
    //   likesInfo: this.generateDefaultLikesInfo(),
    // };
    return;
  }

  private generateDefaultLikesInfo(): LikesInfo {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };
  }
}
