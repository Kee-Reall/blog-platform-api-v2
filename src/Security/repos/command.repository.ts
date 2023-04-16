import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpres/SQL';
import { Nullable, NullablePromise, SessionJwtMeta } from '../../Model';

@Injectable()
export class AuthCommandRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}
  public async createSession(
    id: number,
    agent: string,
    ip: string,
  ): NullablePromise<SessionJwtMeta> {
    try {
      const result = await this.ds.query(
        `
INSERT INTO ${TablesENUM.SESSIONS}("userId","updateDate", "lastIP", title)
VALUES ($1,NOW(),$2,$3)
RETURNING "deviceId","userId","updateDate"
    `,
        [id, ip, agent],
      );
      if (result.length < 1) {
        return null;
      }
      return result[0];
    } catch (e) {
      return null;
    }
  }

  public async updateSession(
    deviceId: number,
    ip: Nullable<string>,
  ): Promise<Nullable<SessionJwtMeta>> {
    try {
      const result = await this.ds.query(
        `
UPDATE public."Sessions"
SET "updateDate"=NOW(), "lastIP"=$2
WHERE "deviceId" = $1
RETURNING *
    `,
        [deviceId, ip],
      );
      console.log(result);
      const [sessions, modified] = result;
      if (modified < 1) {
        return null;
      }
      const [session] = sessions;
      return {
        userId: session.userId,
        deviceId: session.deviceId,
        updateDate: session.updateDate.toISOString(),
      };
    } catch (e) {
      return null;
    }
  }
}
