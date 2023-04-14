import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm';
import { UserCreationModel } from '../../Model';

@Injectable()
export class AdminCommandRepository {
  constructor(
    @InjectEntityManager() private entt: EntityManager,
    @InjectDataSource() private ds: DataSource,
  ) {}

  public async createUser(command: UserCreationModel): Promise<boolean> {
    try {
      const result = await this.ds.query(
        `
    INSERT INTO public."Users"(login, email, hash)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
        [command.login, command.email, command.hash],
      );
      const id: number = result[0].id;
      const [confirmSting, banString, recoveryString] = [
        `INSERT INTO public."Confirmation"("userId",status,date) VALUES ($1, true, NOW())`,
        `INSERT INTO public."AdminUsersBans"("userId", status) VALUES ($1, false)`,
        `INSERT INTO public."UsersRecovery"("userId") VALUES ($1)`,
      ];

      await Promise.all([
        this.ds.query(confirmSting, [id]),
        this.ds.query(banString, [id]),
        this.ds.query(recoveryString, [id]),
      ]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
