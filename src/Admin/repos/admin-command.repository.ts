import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreationContract } from '../../Base';
import { TablesENUM } from '../../Helpres/SQL';
import { UserCreationModel } from '../../Model';

@Injectable()
export class AdminCommandRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async createUser(dto: UserCreationModel): Promise<CreationContract> {
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
      const dbQueries = [
        `INSERT INTO ${TablesENUM.CONFIRMATIONS}("userId",status,date) VALUES ($1, true, NOW())`,
        `INSERT INTO ${TablesENUM.USERS_BAN_LIST_BY_ADMIN}("userId", status) VALUES ($1, false)`,
        `INSERT INTO ${TablesENUM.RECOVERIES_INFO}("userId") VALUES ($1)`,
      ];
      await Promise.all(
        dbQueries.map(async (query) => await queryRunner.query(query, [id])),
      );
      await queryRunner.commitTransaction();
      contract.setId(id);
    } catch (e) {
      contract.setFailed();
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return contract;
    }
  }
}
