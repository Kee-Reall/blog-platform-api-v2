import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BlogPresentationModel,
  Direction,
  IBlogPaginationConfig,
  PaginatedOutput,
} from '../../../Model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../../Helpers/SQL';

export class GetBlogs {
  constructor(public filter: IBlogPaginationConfig) {}
}

@QueryHandler(GetBlogs)
export class GetPaginatedBlogsUseCase implements IQueryHandler<GetBlogs> {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}
  public async execute(
    query: GetBlogs,
  ): Promise<PaginatedOutput<BlogPresentationModel>> {
    const blogsQuery = `
SELECT 
b.id::VARCHAR, b.name, b.description, b."websiteUrl", b."createdAt",b."isMembership"
FROM ${TablesENUM.BLOGS} AS b
JOIN ${TablesENUM.USERS} AS u
ON b."ownerId" = u.id
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON abb."blogId" = b."id"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON aub."userId" = b."ownerId"
WHERE (
    b."isDeleted" = false AND
    u."isDeleted" = false AND
    abb.status = false AND 
    aub.status = false
    ) AND b.name ILIKE '%' || COALESCE($1,'') || '%'
${this.generateOrder(query.filter.sortDirection, query.filter.sortBy)}
LIMIT $2 OFFSET $3
    `;
    const itemProm = this.ds.query(blogsQuery, [
      query.filter.searchNameTerm,
      query.filter.limit,
      query.filter.shouldSkip,
    ]);
    const totalCountQuery = `
SELECT COUNT(*)::INT AS "totalCount"
FROM ${TablesENUM.BLOGS} AS b
JOIN ${TablesENUM.USERS} AS u
ON b."ownerId" = u.id
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON abb."blogId" = b."id"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON aub."userId" = b."ownerId"
WHERE (
    b."isDeleted" = false AND
    u."isDeleted" = false AND
    abb.status = false AND 
    aub.status = false
    ) AND b.name ILIKE '%' || COALESCE($1,'') || '%'
    `;
    const countProm = this.ds.query(totalCountQuery, [
      query.filter.searchNameTerm,
    ]);
    const [items, [{ totalCount }]] = await Promise.all([itemProm, countProm]);
    console.log(totalCount);
    return {
      pagesCount: Math.ceil(totalCount / query.filter.limit),
      page: query.filter.pageNumber,
      pageSize: query.filter.limit,
      totalCount,
      items,
    };
  }

  private generateOrder(
    direction: Direction,
    sortBy: string | keyof BlogPresentationModel,
  ) {
    let orderString = `ORDER BY `;
    switch (sortBy) {
      case 'id':
        orderString += 'b.id ';
        break;
      case 'description':
        orderString += 'b.description ';
        break;
      case 'websiteUrl':
        orderString += 'b."websiteUrl" ';
        break;
      case 'name':
        orderString += 'b.name ';
        break;
      case 'isMembership':
        orderString += 'b."isMembership" ';
        break;
      default:
        orderString += `b."createdAt" `;
    }
    orderString += direction.toLowerCase() === 'desc' ? direction : 'asc';
    return orderString;
  }
}
