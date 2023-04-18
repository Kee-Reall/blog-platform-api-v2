import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpers/SQL';
import { AbstractRepository } from '../../Base';
import {
  NullablePromise,
  SessionJwtMeta,
  UserForLogin,
  UserStatus,
} from '../../Model';

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

  public async getSession(deviceId: number): NullablePromise<SessionJwtMeta> {
    try {
      const result = await this.ds.query(
        `
SELECT s."deviceId", s."userId", s."updateDate" FROM ${TablesENUM.SESSIONS} AS s
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
        deviceId: session.deviceId,
      };
    } catch (e) {
      return null;
    }
  }

  public async checkUniqueUser(login: string, email: string) {
    return this.getUniqueUserError(this.ds, login, email);
  }

  public async getUserStatusByEmail(
    email: string,
  ): NullablePromise<UserStatus> {
    try {
      const result = await this.ds.query(
        `
SELECT u."isDeleted", ab.status AS "isBanned",c.status AS "isConfirmed"
FROM ${TablesENUM.USERS} AS u
JOIN ${TablesENUM.CONFIRMATIONS} AS c
ON u.id = c."userId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
ON u.id = ab."userId"
WHERE u.email = $1
      `,
        [email],
      );
      if (result.length < 1) {
        return null;
      }
      const [userStatus] = result;
      return userStatus;
    } catch (e) {
      return null;
    }
  }

  public async getUserStatusByCode(
    code: string,
  ): NullablePromise<[UserStatus, Date]> {
    try {
      const result = await this.ds.query(
        `
SELECT 
c.date as "confirmDate", u."isDeleted", ab.status AS "isBanned",c.status AS "isConfirmed"
FROM ${TablesENUM.USERS} AS u
JOIN ${TablesENUM.CONFIRMATIONS} AS c
ON u.id = c."userId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
ON u.id = ab."userId"
WHERE c.code = $1
      `,
        [code],
      );
      if (result.length < 1) {
        return null;
      }
      const [userInfo] = result;
      const userStatus: UserStatus = {
        isBanned: userInfo.isBanned,
        isConfirmed: userInfo.isConfirmed,
        isDeleted: userInfo.isDeleted,
      };
      const confirmDate = userInfo.confirmDate;
      return [userStatus, confirmDate];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getUserMetaByRecoveryCode(
    recoveryCode: string,
  ): NullablePromise<[UserStatus, Date, number]> {
    try {
      const result = await this.ds.query(
        `
SELECT 
u.id,u."isDeleted", ab.status AS "isBanned",c.status AS "isConfirmed", r.expiration
FROM ${TablesENUM.USERS} AS u
JOIN ${TablesENUM.CONFIRMATIONS} AS c
ON u.id = c."userId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
ON u.id = ab."userId"
JOIN ${TablesENUM.RECOVERIES_INFO} AS r
ON u.id = r."userId"
WHERE r.code = $1
      `,
        [recoveryCode],
      );
      if (result.length < 1) {
        return null;
      }
      const [info] = result;
      const status: UserStatus = {
        isBanned: info.isBanned,
        isConfirmed: info.isConfirmed,
        isDeleted: info.isDeleted,
      };
      const exp = info.expiration;
      return [status, exp, info.id];
    } catch (e) {
      return null;
    }
  }

  public async getSessions(userId: number) {
    try {
      return await this.ds.query(
        `
SELECT "lastIP" AS ip, title, "updateDate" AS "lastActiveDate",
"deviceId"::VARCHAR FROM ${TablesENUM.SESSIONS} WHERE "userId" = $1
      `,
        [userId],
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
