import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpres/SQL';
import { NullablePromise, UserForLogin } from '../../Model';

@Injectable()
export class AuthQueryRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}
  public async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): NullablePromise<UserForLogin> {
    try {
      const result = await this.ds.query(
        `
SELECT u.id, u.hash, c.status AS confirmed, ab.status AS banned, u."isDeleted"
FROM ${TablesENUM.USERS} AS u
LEFT JOIN ${TablesENUM.CONFIRMATIONS} AS c 
ON u.id = c."userId"
LEFT JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
ON u.id = ab."userId"
WHERE u.login = $1 OR u.email = $1
    `,
        [loginOrEmail],
      );
      if (result.length < 0) {
        return null;
      }
      const rawUser = result[0];
      return {
        id: rawUser.id,
        hash: rawUser.hash,
        isConfirmed: rawUser.confirmed,
        isBanned: rawUser.banned,
        isDeleted: rawUser.isDeleted,
      };
    } catch (e) {
      return null;
    }
  }
}
