import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DbRowMessage } from '../../Model/Types/dbTransfers.types';

@Injectable()
export class AdminQueryRepository {
  constructor(@InjectDataSource() private ds: DataSource) {}

  public async getUserByLoginOrEmail(
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
