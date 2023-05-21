import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpers/SQL';

@Injectable()
export class PublicQueryRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}
  public async getBlogById(id: number) {
    try {
      const dbQueryResult = await this.ds.query(
        `
SELECT b.*
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
      console.log(dbQueryResult);
    } catch (e) {
      return null;
    }
  }
}
