import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BlogCreationModel, BlogPresentationModel } from '../../Model';
import { Contract } from '../../Base';
import { TablesENUM } from '../../Helpers/SQL';

@Injectable()
export class BloggerCommandRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async crateBlog(
    blogCreation: BlogCreationModel,
  ): Promise<Contract<BlogPresentationModel>> {
    const queryRunner = this.ds.createQueryRunner();
    const contract = new Contract<BlogPresentationModel>();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const dbResult = await queryRunner.query(
        `
INSERT INTO ${TablesENUM.BLOGS}(name,description,"websiteUrl","ownerId")
VALUES($1, $2, $3, $4)
RETURNING id::VARCHAR, name, description, "websiteUrl", "createdAt", "isMembership"
      `,
        [
          blogCreation.name,
          blogCreation.description,
          blogCreation.websiteUrl,
          blogCreation.userId,
        ],
      );
      const blogPres = dbResult[0] as BlogPresentationModel;
      const id: number = <number>blogPres.id;
      await queryRunner.query(
        `
INSERT INTO ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN}("blogId",date,status)
VALUES($1,NULL,false)
        `,
        [id],
      );
      contract.setPayload(blogPres);
      contract.setSuccess();
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      contract.setFailed();
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return contract;
  }

  public async deleteBlogByBlogId(id: string | number) {
    try {
      const dbQueryResult = await this.ds.query(
        `
UPDATE ${TablesENUM.BLOGS}
SET "isDeleted" = true
WHERE id = $1
      `,
        [id],
      );
      return dbQueryResult[1] === 1;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
