import { DataSource } from 'typeorm';
import { DbRowMessage } from '../../../Model';
import { TablesENUM } from '../../../Helpers/SQL';

export abstract class AbstractRepository {
  protected async getUniqueUserError(
    dataSource: DataSource,
    login: string,
    email: string,
  ): Promise<DbRowMessage[]> {
    return dataSource.query(
      `
SELECT 'login' AS field FROM ${TablesENUM.USERS} WHERE login = $1 
UNION 
SELECT 'email' AS field FROM ${TablesENUM.USERS} WHERE email = $2;
    `,
      [login, email],
    );
  }
}
