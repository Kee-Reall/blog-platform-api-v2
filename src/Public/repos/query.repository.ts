import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../../Helpers/SQL';
import { BlogWithExtended, NullablePromise } from '../../Model';

@Injectable()
export class PublicQueryRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(@InjectDataSource() private ds: DataSource) {}
  public async getBlogById(id: number): NullablePromise<BlogWithExtended> {
    try {
      const [raw] = await this.ds.query(
        `
SELECT b.*, 
u."isDeleted" AS "isOwnerDeleted",
ab.status AS "isOwnerBanned",
abb.status AS "isBlogBanned"
FROM ${TablesENUM.BLOGS} as b
JOIN ${TablesENUM.USERS} as u
ON b."ownerId" = u.id
JOIN ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
ON b."ownerId" = ab."userId"
JOIN ${TablesENUM.BLOGS_BAN_LIST_BY_ADMIN} AS abb
ON b.id = abb."blogId"
WHERE b.id = $1
      `,
        [id],
      );
      return {
        id: raw.id.toString(),
        name: raw.name,
        description: raw.description,
        websiteUrl: raw.websiteUrl,
        isMembership: raw.isMembership,
        createdAt: raw.createdAt,
        extendedInfo: {
          ownerId: raw.ownerId,
          isDeleted: raw.isDeleted,
          isOwnerDeleted: raw.isOwnerDeleted,
          isOwnerBanned: raw.isOwnerBanned,
          isBlogBanned: raw.isBlogBanned,
        },
      };
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
