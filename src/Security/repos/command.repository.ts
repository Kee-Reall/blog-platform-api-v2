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
UPDATE ${TablesENUM.SESSIONS}
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

  public async killSession(meta: SessionJwtMeta): Promise<boolean> {
    try {
      const deleted = (
        (await this.ds.query(
          `DELETE FROM ${TablesENUM.SESSIONS} WHERE "deviceId" = $1 AND "userId" = $2`,
          [meta.deviceId, meta.userId],
        )) as Array<unknown>
      ).at(-1);
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

  public async updateConfirmationCode(
    email: string,
    code: string,
    newTime: Date,
  ): VoidPromise {
    const result: Array<unknown> = await this.ds.query(
      `
UPDATE ${TablesENUM.CONFIRMATIONS}
SET code = $2, date = $3
WHERE "userId" = (
  SELECT id FROM ${TablesENUM.USERS}
  WHERE email = $1
)
      `,
      [email, code, newTime],
    );
    const updated = result.at(-1);
    if (updated !== 1) {
      throw new Error();
    }
    return;
  }

  public async confirmUser(code: string): Promise<boolean> {
    try {
      const result = await this.ds.query(
        `
UPDATE ${TablesENUM.CONFIRMATIONS}
SET code = NULL, date = NOW(), status = true
WHERE code = $1
      `,
        [code],
      );
      return result[1] === 1;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async setRecoveryStatus(
    email: string,
    recoveryCode: string,
    newDate: Date,
  ): VoidPromise {
    try {
      await this.ds.query(
        `
UPDATE ${TablesENUM.RECOVERIES_INFO}
SET code=$2, expiration=$3
WHERE "userId" = (
  SELECT id from ${TablesENUM.USERS}
  WHERE email = $1
)
      `,
        [email, recoveryCode, newDate],
      );
    } catch (e) {
      console.log(e);
    } finally {
      return;
    }
  }

  public async setNewPassword(userId: number, hash: string): Promise<boolean> {
    let isSuccess: boolean;
    const queryRunner = this.ds.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updatePassword = queryRunner.query(
        `
UPDATE ${TablesENUM.USERS}
SET hash = $2
WHERE id = $1
      `,
        [userId, hash],
      );
      const resetRecovery = queryRunner.query(
        `
UPDATE ${TablesENUM.RECOVERIES_INFO}
SET code = NULL, expiration = NULL
WHERE "userId" = $1
      `,
        [userId],
      );
      await Promise.all([updatePassword, resetRecovery]);
      await queryRunner.commitTransaction();
      isSuccess = true;
    } catch (e) {
      isSuccess = false;
      await queryRunner.rollbackTransaction();
      console.log(e);
    } finally {
      await queryRunner.release();
      return isSuccess;
    }
  }
}
