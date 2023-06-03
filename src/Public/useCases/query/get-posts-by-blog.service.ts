import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { TablesENUM } from '../../../Helpers/SQL';
import { PublicQueryRepository } from '../../repos';
import {
  Direction,
  ExtendedLikesInfo,
  IPaginationConfig,
  Nullable,
  PaginatedOutput,
  PostPresentationModel,
  sqlQuery,
  WithExtendedLike,
} from '../../../Model';

export class GetPostsByBlog {
  constructor(
    public readonly userId: Nullable<string | number>,
    public readonly blogId: string | number,
    public readonly filter: IPaginationConfig,
  ) {}
}

@QueryHandler(GetPostsByBlog)
export class GetPostsByBlogsUseCase implements IQueryHandler<GetPostsByBlog> {
  constructor(
    @InjectDataSource() private ds: DataSource,
    private repo: PublicQueryRepository,
  ) {}
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

    const queryString: sqlQuery = `
SELECT 
p.id::VARCHAR, p.title, p."shortDescription", p.content, p."blogId"::VARCHAR, p."createdAt", b.name as "blogName"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
WHERE p."isDeleted" = false AND b.id = $1
${this.generateOrder(query.filter.sortBy, query.filter.sortDirection)}
LIMIT $2 OFFSET $3
    `;
    const totalCountQuery: sqlQuery = `
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

  private getExtendedLikeInfo(): ExtendedLikesInfo {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
  }

  private generateOrder(
    orderBy: keyof PostPresentationModel | string,
    direction: Direction,
  ): string {
    let str = 'ORDER BY ';
    switch (orderBy) {
      case 'blogId':
        str += `p."blogId`;
        break;
      case 'id':
        str += `p.id`;
        break;
      case 'content':
        str += `p.content`;
        break;
      case 'blogName':
        str += 'b."blogName"';
        break;
      case 'shortDescription':
        str += 'p."shortDescription"';
        break;
      case 'title':
        str += 'p.title';
        break;
      default:
        str += 'p."createdAt"';
        break;
    }
    direction = direction.toLowerCase() === 'asc' ? direction : 'DESC';
    str += ` ${direction}`;
    return str;
  }
}
