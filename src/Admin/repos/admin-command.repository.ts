import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';
import { CreationContract } from '../../Base';
import { TablesENUM } from '../../Helpres/SQL';
import { UserCreationModel } from '../../Model';

@Injectable()
export class AdminCommandRepository {
  constructor(
    @InjectEntityManager() private entt: EntityManager,
    @InjectDataSource() private ds: DataSource,
  ) {}

  public async createUser(dto: UserCreationModel): Promise<CreationContract> {
    const qr: QueryRunner = this.ds.createQueryRunner();
    const contract = new CreationContract();
    await qr.connect();
    await qr.startTransaction();
    try {
      const result = await qr.query(
        `
INSERT INTO ${TablesENUM.USERS}(login, email, hash)
VALUES ($1, $2, $3)
RETURNING id
    `,
        [dto.login, dto.email, dto.hash],
      );
      const id: number = result[0].id;
      const [confirmSting, banString, recoveryString] = [
        `INSERT INTO ${TablesENUM.CONFIRMATIONS}("userId",status,date) VALUES ($1, true, NOW())`,
        `INSERT INTO ${TablesENUM.USERS_BAN_LIST_BY_ADMIN}("userId", status) VALUES ($1, false)`,
        `INSERT INTO ${TablesENUM.RECOVERIES_INFO}("userId") VALUES ($1)`,
      ];
      await Promise.all([
        qr.query(confirmSting, [id]),
        qr.query(banString, [id]),
        qr.query(recoveryString, [id]),
      ]);
      await qr.commitTransaction();
      contract.setId(id);
    } catch (e) {
      contract.setFailed();
      await qr.rollbackTransaction();
    } finally {
      await qr.release();
      return contract;
    }
  }
}
