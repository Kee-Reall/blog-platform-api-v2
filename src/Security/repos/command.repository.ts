import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpres/SQL';
import { NullablePromise, SessionJwtMeta } from '../../Model';

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
}
