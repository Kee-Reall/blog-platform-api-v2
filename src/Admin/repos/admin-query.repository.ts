import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DbRowMessage } from '../../Model';

@Injectable()
export class AdminQueryRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async checkUniqueUser(
    login: string,
    email: string,
  ): Promise<DbRowMessage[]> {
    return this.ds.query(
      `
SELECT 'login' AS field FROM public."Users" WHERE login = $1 
UNION 
SELECT 'email' AS field FROM public."Users" WHERE email = $2;
    `,
      [login, email],
    );
  }
}
