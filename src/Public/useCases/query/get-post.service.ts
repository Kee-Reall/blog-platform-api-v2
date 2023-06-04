import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  Nullable,
  PostPresentationModel,
  WithExtendedLike,
} from '../../../Model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../../Helpers/SQL';
import { NotFoundException } from '@nestjs/common';
import { GetPostsAbstract } from '../shared/get-post.class';

export class GetPost {
  constructor(public postId: string, public userId: Nullable<string | number>) {
    if (!userId) {
      this.userId = null;
    }
  }
}

@QueryHandler(GetPost)
export class GetPostUseCase
  extends GetPostsAbstract
  implements IQueryHandler<GetPost>
{
  constructor(@InjectDataSource() private ds: DataSource) {
    super();
  }
  public async execute(
    query: GetPost,
  ): Promise<WithExtendedLike<PostPresentationModel>> {
    const queryResult = await this.ds.query(
      `
SELECT p.*,
b.name AS "blogName", b."isDeleted" AS "isBlogDeleted", 
abb.status AS "isBlogBanned", u."isDeleted" AS "isOwnerDeleted", 
aub.status AS "isOwnerBanned"
FROM ${TablesENUM.POSTS} AS p
JOIN ${TablesENUM.BLOGS} AS b
ON p."blogId" = b.id
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON abb."blogId" = p."blogId"
JOIN ${TablesENUM.USERS} AS u
ON u.id = p."ownerId"
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS aub
ON aub."userId" = p."ownerId"
WHERE p.id = $1
    `,
      [query.postId],
    );
    if (queryResult.length <= 0) {
      throw new NotFoundException();
    }
    const raw = queryResult[0];
    const isDeleted = raw.isDeleted || raw.isBlogDeleted || raw.isUserDeleted;
    const isBanned = raw.isBlogBanned || raw.isOwnerBanned;
    if (isDeleted || isBanned) {
      throw new NotFoundException();
    }
    return {
      id: raw.id.toString(),
      title: raw.title,
      shortDescription: raw.shortDescription,
      content: raw.content,
      blogId: raw.blogId.toString(),
      blogName: raw.blogName,
      createdAt: raw.createdAt,
      extendedLikesInfo: this.getExtendedLikeInfo(),
    };
  }
}
