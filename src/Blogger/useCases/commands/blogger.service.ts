import { Nullable } from '../../../Model';
import { DeletePost } from './delete-post.service';
import { UpdatePost } from './update-post.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BloggerQueryRepository } from '../../repos';

type fixLater = any;

export abstract class BloggerService {
  protected isOwner(userId: string, ownerId: fixLater): boolean {
    try {
      return userId === ownerId.toHexString();
    } catch (e) {
      return false;
    }
  }

  protected isPostBelongToBlog(post: fixLater, blog: fixLater): boolean {
    return blog.id === post.blogId;
  }

  protected isAllFound(
    entities: [Nullable<fixLater>, Nullable<fixLater>, Nullable<fixLater>],
  ): boolean {
    for (const entt of entities) {
      if (!entt) {
        return false;
      }
    }
    return true;
  }

  protected isUserOwnBlogAndPost(
    user: fixLater,
    blog: fixLater,
    post: fixLater,
  ) {
    return (
      this.isOwner(user.id, blog._blogOwnerInfo.userId) &&
      this.isOwner(user.id, post._ownerId)
    );
  }

  protected async checkEntitiesThenGetPost(
    command: DeletePost | UpdatePost,
    repo: BloggerQueryRepository,
  ): Promise<fixLater> {
    //const entities = await Promise.all([
    // repo.getUserEntity(command.userId),
    // repo.getBlogEntity(command.blogId),
    // repo.getPostEntity(command.postId),
    // ]);
    // if (!this.isAllFound(entities)) {
    //   throw new NotFoundException();
    // }
    // const [user, blog, post] = entities;
    // if (blog._isOwnerBanned) {
    //   throw new NotFoundException();
    // }
    // if (!this.isPostBelongToBlog(post, blog)) {
    //   throw new NotFoundException();
    // }
    // if (!this.isUserOwnBlogAndPost(user, blog, post)) {
    //   throw new ForbiddenException();
    // }
    // return post;
    return;
  }
}
