import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BlogFilter,
  IPaginationConfig,
  PaginatedOutput,
  UserForBloggerPresentation,
} from '../../../Model';
import { BloggerQueryRepository } from '../../repos';

export class GetBannedUsers {
  // public config: IPaginationConfig;
  // constructor(
  //   public ownerId: string,
  //   public blogId: string,
  //   filter: BlogFilter,
  // ) {
  //   this.config = new UsersForBloggerPaginationPipe(filter, ownerId, blogId);
  // }
}

@QueryHandler(GetBannedUsers)
export class GetBannedUsersUseCase implements IQueryHandler<GetBannedUsers> {
  constructor(private repo: BloggerQueryRepository) {}
  public async execute(
    query: GetBannedUsers,
  ): Promise<PaginatedOutput<UserForBloggerPresentation>> {
    // const blog = await this.repo.getBlogEntity(query.blogId);
    // if (!blog) {
    //   throw new NotFoundException();
    // }
    // if (blog._blogOwnerInfo.userId.toHexString() !== query.ownerId) {
    //   throw new ForbiddenException();
    // }
    //return this.repo.getBannedUsersWithPaginationConfigForOwner(query.config);
    return;
  }
}
