import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TablesENUM } from '../../Helpers/SQL';

@Injectable()
export class BloggerQueryRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async getBlogById(id: number) {
    try {
      const queryResult = await this.ds.query(
        `
SELECT * FROM ${TablesENUM.BLOGS}
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
}
