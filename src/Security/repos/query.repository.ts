import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpers/SQL';
import { NullablePromise, SessionsFromDb, UserForLogin } from '../../Model';
import { AbstractRepository } from '../../Base';

@Injectable()
export class AuthQueryRepository extends AbstractRepository {
  constructor(@InjectDataSource() private ds: DataSource) {
    super();
  }
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

  public async getSession(deviceId: number): NullablePromise<SessionsFromDb> {
    try {
      const result = await this.ds.query(
        `
SELECT s."userId", s."updateDate" FROM ${TablesENUM.SESSIONS} AS s
JOIN ${TablesENUM.USERS} AS u ON u.id = s."userId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab ON u.id = ab."userId"
WHERE s."deviceId" = $1 AND u."isDeleted" = false AND ab.status = false
      `,
        [deviceId],
      );
      if (result.length < 1) {
        return null;
      }
      const session = result[0];
      return {
        updateDate: session.updateDate.toISOString(),
        userId: session.userId,
      };
    } catch (e) {
      return null;
    }
  }

  public async checkUniqueUser(login: string, email: string) {
    return this.getUniqueUserError(this.ds, login, email);
  }
}
