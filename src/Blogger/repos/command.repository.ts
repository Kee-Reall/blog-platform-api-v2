import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlogCreationModel } from '../../Model';
import { CreationContract } from '../../Base';
import { TablesENUM } from '../../Helpers/SQL';

@Injectable()
export class BloggerCommandRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async crateBlog(
    blogCreation: BlogCreationModel,
  ): Promise<CreationContract> {
    const queryRunner = this.ds.createQueryRunner();
    const contract = new CreationContract();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dbResult = await queryRunner.query(
        `
INSERT INTO ${TablesENUM.BLOGS}(name,description,"websiteUrl","ownerId")
VALUES($1, $2, $3, $4)
RETURNING *
      `,
        [
          blogCreation.name,
          blogCreation.description,
          blogCreation.websiteUrl,
          blogCreation.userId,
        ],
      );
      const id: number = dbResult[0].id;
      await queryRunner.query(
        `
INSERT INTO ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN}("blogId",date,status)
VALUES($1,NULL,false)
        `,
        [id],
      );
      contract.setId(id);
      contract.setSuccess();
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      contract.setFailed();
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      return contract;
    }
  }
}
