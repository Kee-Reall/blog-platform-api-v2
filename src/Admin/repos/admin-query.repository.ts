import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DbRowMessage,
  Nullable,
  NullablePromise,
  UserPresentationModel,
  UserStatus,
  WithBanInfo,
} from '../../Model';
import { TablesENUM } from '../../Helpers/SQL';
import { AbstractRepository } from '../../Base';

@Injectable()
export class AdminQueryRepository extends AbstractRepository {
  constructor(@InjectDataSource() private ds: DataSource) {
    super();
  }

  public async checkUniqueUser(
    login: string,
    email: string,
  ): Promise<DbRowMessage[]> {
    return await this.getUniqueUserError(this.ds, login, email);
    //return this.ds.query(
    // `
    // SELECT 'login' AS field FROM ${TablesENUM.USERS} WHERE login = $1
    // UNION
    // SELECT 'email' AS field FROM ${TablesENUM.USERS} WHERE email = $2;
    //     `,
    //       [login, email],
    //     );
  }

  public async getUserBeforeDelete(
    id: number,
  ): NullablePromise<Pick<UserStatus, 'isDeleted'>> {
    try {
      const res = await this.ds.query(
        `SELECT "isDeleted" FROM ${TablesENUM.USERS} WHERE id = $1`,
        [id],
      );
      if (res.length < 1) {
        return null;
      }
      return res[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getUser(
    id: number,
  ): Promise<Nullable<WithBanInfo<UserPresentationModel>>> {
    try {
      const result = await this.ds.query(
        `
SELECT 
u.id::VARCHAR, u.login, u.email, u."createdAt", b.date, b.status, b.reason
FROM ${TablesENUM.USERS} AS u
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS b
ON u."id" = b."userId" 
WHERE u.id = $1 AND u."isDeleted" = false
      `,
        [id],
      );
      if (result.length < 1) {
        return null;
      }
      const row = result[0];
      return {
        id: row.id,
        login: row.login,
        email: row.email,
        createdAt: row.createdAt,
        banInfo: {
          isBanned: row.status,
          banDate: row.date,
          banReason: row.reason,
        },
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
