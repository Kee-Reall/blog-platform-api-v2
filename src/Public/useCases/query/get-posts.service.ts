import {
  IPaginationConfig,
  Nullable,
  PostPresentationModel,
  SqlQuery,
} from '../../../Model';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../../../Helpers/SQL';
import { GetPostsAbstract } from '../shared/get-post.class';
import {
  PAGINATE_FUNC,
  PaginateFunc,
} from '../../../Base/helpers/paginate.function';
import { Inject } from '@nestjs/common';

export class GetPosts {
  constructor(
    public userId: Nullable<string | number>,
    public readonly config: IPaginationConfig,
  ) {}
}

@QueryHandler(GetPosts)
export class GetPostsUseCase
  extends GetPostsAbstract
  implements IQueryHandler<GetPosts>
{
  constructor(
    @InjectDataSource() private ds: DataSource,
    @Inject(PAGINATE_FUNC)
    private paginate: PaginateFunc<PostPresentationModel>,
  ) {
    super();
  }
  public async execute(query: GetPosts) {
    const queryStr: SqlQuery = `
SELECT 
p.id::VARCHAR, p.title, p."shortDescription", p.content,
p."blogId"::VARCHAR, p."createdAt", b.name as "blogName"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON p."ownerId" = aub."userId"
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON p."blogId" = abb."blogId"
JOIN ${TablesENUM.USERS} AS  u
ON u.id = p."ownerId"
WHERE (
    p."isDeleted" = false AND
    b."isDeleted" = false AND
    aub.status = false AND
    abb.status = false AND
    u."isDeleted" = false
)
${this.generatePostOrder(query.config.sortBy, query.config.sortDirection)}
LIMIT $1 OFFSET $2
    `;
    const counterStr: SqlQuery = `
SELECT COUNT(*)::INTEGER AS "totalCount"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON p."ownerId" = aub."userId"
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON p."blogId" = abb."blogId"
JOIN ${TablesENUM.USERS} AS  u
ON u.id = p."ownerId"
WHERE (
    p."isDeleted" = false AND
    b."isDeleted" = false AND
    aub.status = false AND
    abb.status = false AND
    u."isDeleted" = false
)
    `;
    const [postsResult, [{ totalCount }]] = await Promise.all([
      this.ds.query(queryStr, [query.config.limit, query.config.shouldSkip]),
      this.ds.query(counterStr),
    ]);
    const items = postsResult.map((post) => ({
      ...post,
      extendedLikeInfo: this.getExtendedLikeInfo(),
    }));
    return this.paginate(query.config, totalCount, items);
  }
}
