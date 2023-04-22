import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BloggerService } from './blogger.service';
import { BloggerCommandRepository, BloggerQueryRepository } from '../../repos';
import {
  PostInputModel,
  PostPresentationModel,
  WithExtendedLike,
} from '../../../Model';

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
  constructor(
    private queryRepo: BloggerQueryRepository,
    private commandRepo: BloggerCommandRepository,
  ) {
    super();
  }
  public async execute(
    command: CreatePost,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    // const blog = await this.queryRepo.getBlogEntity(command.blogId);
    // if (!blog || blog._isBlogBanned) {
    //   throw new NotFoundException();
    // }
    // if (!this.isOwner(command.userId, blog._blogOwnerInfo.userId)) {
    //   throw new ForbiddenException();
    // }
    // const post = new this.mdl({
    //   content: command.content,
    //   shortDescription: command.shortDescription,
    //   title: command.title,
    //   blogId: blog._id,
    //   blogName: blog.name,
    //   _ownerId: blog._blogOwnerInfo.userId,
    // });
    // const isSaved: boolean = await this.commandRepo.savePost(post);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    // return {
    //   ...(post.toJSON() as PostPresentationModel),
    //   ...this.defaultLikeInfo(),
    // };
    return;
  }

  private defaultLikeInfo(): WithExtendedLike<object> {
    return {
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }
}
