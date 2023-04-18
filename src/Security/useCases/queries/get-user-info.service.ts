import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserInfoType } from '../../../Model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../../../Helpers/SQL';
import { NotFoundException } from '@nestjs/common';

export class GetUserInfo {
  constructor(public userId: number) {}
}

@QueryHandler(GetUserInfo)
export class GetUserInfoUseCase implements IQueryHandler<GetUserInfo> {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async execute(query: GetUserInfo): Promise<UserInfoType> {
    const result = await this.ds.query(
      `
SELECT email, login, id::VARCHAR
FROM ${TablesENUM.USERS} WHERE id = $1
`,
      [query.userId],
    );
    if (result.length < 1) {
      throw new NotFoundException();
    }
    return {
      userId: result[0].id,
      login: result[0].login,
      email: result[0].email,
    };
  }
}
