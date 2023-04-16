import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { TablesENUM } from '../../Helpers/SQL';
import {
  Nullable,
  NullablePromise,
  SessionJwtMeta,
  UserCreationModel,
  VoidPromise,
} from '../../Model';
import { CreationContract } from '../../Base';
import { command } from '../useCases';

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

  public async killSessions(meta: SessionJwtMeta): Promise<boolean> {
    try {
      const [_, deleted] = await this.ds.query(
        `DELETE FROM ${TablesENUM.SESSIONS} WHERE "deviceId" = $1 AND "userId" = $2`,
        [meta.deviceId, meta.userId],
      );
      return deleted === 1;
    } catch (e) {
      return false;
    }
  }

  public async createUser(
    dto: Required<UserCreationModel>,
  ): Promise<CreationContract> {
    const queryRunner: QueryRunner = this.ds.createQueryRunner();
    const contract = new CreationContract();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.query(
        `
INSERT INTO ${TablesENUM.USERS}(login, email, hash)
VALUES ($1, $2, $3)
RETURNING id
    `,
        [dto.login, dto.email, dto.hash],
      );
      const id: number = result[0].id;
      const [confirm, ban, recovery] = [
        `INSERT INTO ${TablesENUM.CONFIRMATIONS}("userId",status,date,code) VALUES ($1, false, $2,$3)`,
        `INSERT INTO ${TablesENUM.USERS_BAN_LIST_BY_ADMIN}("userId", status) VALUES ($1, false)`,
        `INSERT INTO ${TablesENUM.RECOVERIES_INFO}("userId") VALUES ($1)`,
      ];
      await Promise.all([
        queryRunner.query(confirm, [id, dto.date, dto.code]),
        queryRunner.query(ban, [id]),
        queryRunner.query(recovery, [id]),
      ]);
      await queryRunner.commitTransaction();
      contract.setId(id);
      contract.setCode(dto.code);
    } catch (e) {
      contract.setFailed();
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return contract;
    }
  }

  public async killUser(id: number): VoidPromise {
    try {
      await this.ds.query(`DELETE FROM ${TablesENUM.USERS} WHERE id=$1`, [id]);
    } finally {
      return;
    }
  }
}
