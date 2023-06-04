import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { TablesENUM } from '../../../Helpers/SQL';
import { PublicQueryRepository } from '../../repos';
import {
  IPaginationConfig,
  Nullable,
  PaginatedOutput,
  PostPresentationModel,
  SqlQuery,
  WithExtendedLike,
} from '../../../Model';
import { GetPostsAbstract } from '../shared/get-post.class';

export class GetPostsByBlog {
  constructor(
    public readonly userId: Nullable<string | number>,
    public readonly blogId: string | number,
    public readonly filter: IPaginationConfig,
  ) {}
}

@QueryHandler(GetPostsByBlog)
export class GetPostsByBlogsUseCase
  extends GetPostsAbstract
  implements IQueryHandler<GetPostsByBlog>
{
  constructor(
    @InjectDataSource() private ds: DataSource,
    private repo: PublicQueryRepository,
  ) {
    super();
  }
  public async execute(
    query: GetPostsByBlog,
  ): Promise<PaginatedOutput<WithExtendedLike<PostPresentationModel>>> {
    const blog = await this.repo.getBlogById(+query.blogId);
    if (isNil(blog)) {
      throw new NotFoundException();
    }

    const { extendedInfo } = blog;
    const isDeleted = extendedInfo.isDeleted || extendedInfo.isOwnerDeleted;
    const isBanned = extendedInfo.isBlogBanned || extendedInfo.isOwnerBanned;
    if (isDeleted || isBanned) {
      throw new NotFoundException();
    }

    const queryString: SqlQuery = `
SELECT 
p.id::VARCHAR, p.title, p."shortDescription", p.content, p."blogId"::VARCHAR, p."createdAt", b.name as "blogName"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
WHERE p."isDeleted" = false AND b.id = $1
${this.generatePostOrder(query.filter.sortBy, query.filter.sortDirection)}
LIMIT $2 OFFSET $3
    `;
    const totalCountQuery: SqlQuery = `
SELECT COUNT(*)::INTEGER AS "totalCount"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
WHERE p."isDeleted" = false AND b.id = $1
    `;
    const [posts, [{ totalCount }]] = await Promise.all([
      this.ds.query(queryString, [
        query.blogId,
        query.filter.limit,
        query.filter.shouldSkip,
      ]),
      this.ds.query(totalCountQuery, [query.blogId]),
    ]);
    const items = posts.map((post) => ({
      ...post,
      extendedLikesInfo: this.getExtendedLikeInfo(),
    }));
    return {
      pagesCount: Math.ceil(totalCount / query.filter.limit),
      page: query.filter.pageNumber,
      pageSize: query.filter.limit,
      totalCount,
      items,
    };
  }
}
