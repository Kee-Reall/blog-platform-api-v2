import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorMessage, UserInputModel } from '../../../Model';
import { MessageENUM } from '../../../Base';
import { AdminQueryRepository } from '../../repos/admin-query.repository';
import { BadRequestException } from '@nestjs/common';
import { DbRowMessage } from '../../../Model/Types/dbTransfers.types';

export class CreateUser implements UserInputModel {
  email: string;
  login: string;
  password: string;

  constructor(dto: UserInputModel) {
    this.email = dto.email;
    this.login = dto.login;
    this.password = dto.password;
  }
}

export type AdminPresentation = any;

@CommandHandler(CreateUser)
export class CreateUserUseCase implements ICommandHandler<CreateUser> {
  constructor(private queryRepo: AdminQueryRepository) {}
  public async execute(command: CreateUser): Promise<AdminPresentation> {
    const errors = await this.queryRepo.getUserByLoginOrEmail(
      command.login,
      command.email,
    );
    if (errors.length > 0) {
      throw new BadRequestException(this.generateNotUniqueError(errors));
    }
    // логика создания
    return;
  }

  private generateNotUniqueError(rows: DbRowMessage[]): {
    errorsMessages: ErrorMessage[];
  } {
    const errorsMessages: ErrorMessage[] = rows.map((row) => ({
      message: MessageENUM.ALREADY_EXISTS,
      field: row.field,
    }));
    return { errorsMessages };
  }
}
