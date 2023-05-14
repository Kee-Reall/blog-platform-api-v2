import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../../Helpers/SQL';
import { Contract } from '../../Base';
import {
  BlogPresentationModel,
  BlogWithExtended,
  PostPresentationModel,
  WithExtendedLike,
} from '../../Model';

@Injectable()
export class BloggerQueryRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  public async getBlogById(id: number): Promise<BlogPresentationModel> {
    try {
      const queryResult = await this.ds.query(
        `
SELECT * 
FROM ${TablesENUM.BLOGS}
WHERE id = $1
      `,
        [id],
      );
      return queryResult[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getBlogByIdWIthMeta(
    id: number | string,
  ): Promise<BlogWithExtended> {
    try {
      const queryResult = await this.ds.query(
        `
SELECT aub.status AS "isOwnerBanned", abb.status AS "isBlogBanned",
b.*, u."isDeleted" AS "isOwnerDeleted"
FROM ${TablesENUM.BLOGS} AS b
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON aub."userId" = b."ownerId"
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON abb."blogId" = b.id
JOIN ${TablesENUM.USERS} AS u
ON u.id = b."ownerId"
WHERE b.id = $1
      `,
        [id],
      );
      if (queryResult.length < 1) {
        return null;
      }
      const rawBlog = queryResult[0];
      const blog: BlogWithExtended = {
        id: rawBlog.id,
        name: rawBlog.name,
        description: rawBlog.description,
        websiteUrl: rawBlog.websiteUrl,
        isMembership: rawBlog.isMembership,
        createdAt: rawBlog.createdAt,
        extendedInfo: {
          isOwnerBanned: rawBlog.isOwnerBanned,
          isOwnerDeleted: rawBlog.isOwnerDeleted,
          isBlogBanned: rawBlog.isBlogBanned,
          isDeleted: rawBlog.isDeleted,
          ownerId: rawBlog.ownerId,
        },
      };
      return blog;
    } catch (e) {
      return null;
    }
  }

  public async getPost(postId: string) {
    const contract = new Contract<WithExtendedLike<PostPresentationModel>>();
    try {
      const dbQueryResult = await this.ds.query(
        `
SELECT p.id::VARCHAR, p.title, p."shortDescription", p.content, p."createdAt",
b.id::VARCHAR AS "blogId", b.name AS "blogName"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON p."blogId" = b.id
WHERE p.id = $1
      `,
        [postId],
      );
      const raw = dbQueryResult[0];
      contract.setPayload({ ...raw, ...this.getDefaultExtendedLike() });
      contract.setSuccess();
    } catch (e) {
      contract.setFailed();
    }
    return contract;
  }

  private getDefaultExtendedLike(): Pick<
    WithExtendedLike<unknown>,
    'extendedLikesInfo'
  > {
    return {
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  public async getPostByIdWIthMeta(postId: string | number) {
    try {
      const [raw] = await this.ds.query(
        `
SELECT p.*, b."isDeleted" AS "isBlogDeleted",
aub.status as "isOwnerBanned",abb.status as "isBlogBanned",
u."isDeleted" as "isOwnerDeleted"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON b.id = p."blogId"
JOIN ${TablesENUM.USERS} as u
ON p."ownerId" = u.id
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON aub."userId" = p."ownerId"
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON abb."blogId" = p."blogId"
WHERE p.id = $1
    `,
        [postId],
      );
      this.logger.debug(raw);
      return;
    } catch (e) {
      this.logger.debug(e, e.stack);
    }
  }
}
