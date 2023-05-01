import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Direction,
  IUserPaginationConfig,
  PaginatedOutput,
  UserPresentationModel,
  WithBanInfo,
} from '../../../Model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../../Helpers/SQL';
import { PaginateQuery } from '../../../Base/classes/commands/paginate.query';

export class GetPaginatedUsers
  extends PaginateQuery
  implements IUserPaginationConfig
{
  public login;
  public email;
  public banStatus;
  constructor(input: IUserPaginationConfig) {
    super(input);
    this.login = input.login;
    this.email = input.email;
    this.banStatus = input.banStatus;
  }
}

@QueryHandler(GetPaginatedUsers)
export class AdminGetUsersHandler implements IQueryHandler<GetPaginatedUsers> {
  constructor(@InjectDataSource() private ds: DataSource) {}
  public async execute(
    query: GetPaginatedUsers,
  ): Promise<PaginatedOutput<WithBanInfo<UserPresentationModel>>> {
    try {
      const queryStr = `
SELECT
u.id::VARCHAR, u.login, u.email, u."createdAt",
ab.status, ab.reason, ab.date as "banDate"
FROM ${TablesENUM.USERS} as u
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} as ab
ON u.id = ab."userId"
WHERE ${this.generateBanStatusSlice(query.banStatus)} (
  u.login ILIKE '%' || COALESCE($1, '') || '%' 
  OR
  u.email ILIKE '%' || COALESCE($2, '') || '%'
) AND u."isDeleted" = false
${this.generateOrder(query.sortBy, query.sortDirection)}
LIMIT $3 OFFSET $4
      `;
      const result: any[] = await this.ds.query(queryStr, [
        query.login,
        query.email,
        query.limit,
        query.shouldSkip,
      ]);
      const items: WithBanInfo<UserPresentationModel>[] = result.map((raw) => ({
        id: raw.id,
        login: raw.login,
        email: raw.email,
        createdAt: raw.createdAt,
        banInfo: {
          isBanned: raw.status,
          banReason: raw.reason,
          banDate: raw.banDate,
        },
      }));
      const count = await this.ds.query(
        `
SELECT COUNT(*)::INT
FROM ${TablesENUM.USERS} as u
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} as ab
ON u.id = ab."userId"
WHERE ${this.generateBanStatusSlice(query.banStatus)} (
  u.login ILIKE '%' || COALESCE($1, '') || '%' 
  OR
  u.email ILIKE '%' || COALESCE($2, '') || '%'
) AND u."isDeleted" = false
      `,
        [query.login, query.email],
      );
      const totalCount = count[0].count;
      return {
        pagesCount: Math.ceil(totalCount / query.limit),
        page: query.pageNumber,
        pageSize: query.limit,
        totalCount,
        items,
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  private generateBanStatusSlice(status: boolean): string {
    if (status === true) {
      return `ab.status = true AND `;
    } else if (status === false) {
      return `ab.status = false AND `;
    } else {
      return '';
    }
  }

  private generateOrder(order: string, direction: Direction): string {
    let result = 'ORDER BY';
    switch (order) {
      case 'id':
        result += ' u.id';
        break;
      case 'login':
        result += ' u.login';
        break;
      case 'email':
        result += ' u.email';
        break;
      default:
        result = 'ORDER BY u."createdAt"';
    }
    if (direction === 'ASC') {
      result += ' ASC';
    } else {
      result += ' DESC';
    }
    console.log(result);
    return result;
  }
}
