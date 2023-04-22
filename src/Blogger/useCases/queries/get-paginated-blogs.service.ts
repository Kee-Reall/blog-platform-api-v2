import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BloggerQueryRepository } from '../../repos';

export class GetPaginatedBlogs {
  // public config: BlogsForOwnerPaginationPipe;
  // constructor(userId: string, filters: BlogFilter) {
  //   this.config = new BlogsForOwnerPaginationPipe(filters, userId);
  // }
}

@QueryHandler(GetPaginatedBlogs)
export class GetPaginatedBlogsUseCase
  implements IQueryHandler<GetPaginatedBlogs>
{
  constructor(private repo: BloggerQueryRepository) {}
  public async execute(query: GetPaginatedBlogs) {
    //return await this.repo.getBlogsWithPaginationConfigForUser(query.config);
  }
}
