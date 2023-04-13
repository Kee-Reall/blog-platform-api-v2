import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BlogFilter,
  BlogPresentationModel,
  PaginatedOutput,
} from '../../../Model';

export class GetPaginatedBlogs {
  constructor(public input?: BlogFilter) {}
}

@QueryHandler(GetPaginatedBlogs)
export class AdminGetBlogsHandler implements IQueryHandler<GetPaginatedBlogs> {
  public async execute(
    query: GetPaginatedBlogs,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    //return await this.queryRepo.getBlogsWithPaginationConfig(config);
    return;
  }
}
