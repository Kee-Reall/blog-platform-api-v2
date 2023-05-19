import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  BlogCreationModel,
  BlogInputModel,
  BlogPresentationModel,
  PostInputModel,
} from '../../Model';
import { Contract } from '../../Base';
import { TablesENUM } from '../../Helpers/SQL';
import { CreatePost } from '../useCases/commands/create-post.service';

@Injectable()
export class BloggerCommandRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  private logger = new Logger(this.constructor.name);

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

  public async updateBlog(id: string | number, input: BlogInputModel) {
    try {
      const dbQueryResult = await this.ds.query(
        `
UPDATE ${TablesENUM.BLOGS}
SET name = $1 , description = $2, "websiteUrl" = $3
WHERE id = $4
      `,
        [input.name, input.description, input.websiteUrl, id],
      );
      return dbQueryResult[1] === 1;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  public async createPost(command: CreatePost): Promise<Contract<string>> {
    const contract = new Contract<string>();
    try {
      const { title, shortDescription, content, blogId, userId } = command;
      const dbQueryResult = await this.ds.query(
        `
INSERT INTO ${TablesENUM.POSTS}
("ownerId", "blogId", content, "shortDescription", title)
VALUES($1,$2,$3,$4,$5)
RETURNING id::VARCHAR
      `,
        [userId, blogId, content, shortDescription, title],
      );
      const rawPost = dbQueryResult[0];
      contract.setPayload(rawPost.id);
      contract.setSuccess();
    } catch (e) {
      this.logger.error(e, e.stack);
      contract.setFailed();
    }
    return contract;
  }

  public async updatePost(id: number, dto: PostInputModel): Promise<boolean> {
    try {
      const { shortDescription, title, content } = dto;
      const [_, updatedQuality] = await this.ds.query(
        `
UPDATE ${TablesENUM.POSTS}
SET "shortDescription" = $1, title = $2, content = $3
WHERE id = $4
      `,
        [shortDescription, title, content, id],
      );
      return updatedQuality > 0;
    } catch (e) {
      return false;
    }
  }

  public async deletePost(id: number): Promise<boolean> {
    try {
      const [_, updatedQuality] = await this.ds.query(
        `
UPDATE ${TablesENUM.POSTS}
SET "isDeleted" = TRUE
WHERE id = $1
        `,
        [id],
      );
      return updatedQuality > 0;
    } catch (e) {
      return false;
    }
  }
}
