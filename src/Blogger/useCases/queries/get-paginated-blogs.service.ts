import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BloggerQueryRepository } from '../../repos';
import {
  BlogPresentationModel,
  Direction,
  IBlogPaginationConfig,
} from '../../../Model';
import { PaginateQuery } from '../../../Base/classes/commands/paginate.query';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../../Helpers/SQL';
import { Logger } from '@nestjs/common';

export class GetPaginatedBlogs
  extends PaginateQuery
  implements IBlogPaginationConfig
{
  public searchNameTerm: string;
  constructor(public userId: number, filters: IBlogPaginationConfig) {
    super(filters);
    this.searchNameTerm = filters.searchNameTerm;
  }
}

@QueryHandler(GetPaginatedBlogs)
export class GetPaginatedBlogsUseCase
  implements IQueryHandler<GetPaginatedBlogs>
{
  private logger = new Logger(this.constructor.name);
  constructor(
    @InjectDataSource() private ds: DataSource,
    private repo: BloggerQueryRepository,
  ) {}
  public async execute(query: GetPaginatedBlogs) {
    try {
      const dbQueryResult = await this.ds.query(
        `
SELECT 
id::VARCHAR, name, description, "websiteUrl", "createdAt", "isMembership"
FROM ${TablesENUM.BLOGS}
WHERE "ownerId" = $1 AND name ILIKE '%' || COALESCE($2,'') || '%'
${this.generateOrder(query.sortBy, query.sortDirection)}
LIMIT $3 OFFSET $4
    `,
        [query.userId, query.searchNameTerm, query.limit, query.shouldSkip],
      );
      const items: BlogPresentationModel[] = dbQueryResult;

      const dbCountResult = await this.ds.query(
        `
SELECT COUNT(*)::INT
FROM ${TablesENUM.BLOGS}
WHERE "ownerId" = $1 AND name ILIKE '%' || COALESCE($2,'') || '%'
    `,
        [query.userId, query.searchNameTerm],
      );
      const totalCount = dbCountResult[0].count;
      console.log(query.limit);
      return {
        pagesCount: Math.ceil(totalCount / query.limit),
        page: query.pageNumber,
        pageSize: query.limit,
        totalCount,
        items,
      };

      this.logger.verbose(dbQueryResult);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private generateOrder(order: string, direction: Direction): string {
    let result = 'ORDER BY ';
    switch (order) {
      case 'id':
        result += 'id';
        break;
      case 'name':
        result += 'name';
        break;
      case 'description':
        result += 'description';
        break;
      case 'websiteUrl':
        result += '"websiteUrl"';
        break;
      default:
        result += '"createdAt"';
    }
    if (direction === 'ASC') {
      result += ' ASC';
    } else {
      result += ' DESC';
    }
    return result;
  }
}
