import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageENUM } from '../../../Base';
import { AdminQueryRepository } from '../../repos/admin-query.repository';
import {
  DbRowMessage,
  ErrorMessage,
  UserInputModel,
  UserCreationModel,
} from '../../../Model';
import { AdminCommandRepository } from '../../repos/admin-command.repository';
import { hash as genHash, genSalt } from 'bcrypt';

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
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(command: CreateUser): Promise<AdminPresentation> {
    const errors = await this.queryRepo.checkUniqueUser(
      command.login,
      command.email,
    );
    if (errors.length > 0) {
      throw new BadRequestException(this.generateNotUniqueError(errors));
    }
    const dto: UserCreationModel = {
      login: command.login,
      email: command.email,
      hash: await genHash(command.password, await genSalt(8)),
    };
    const isSaved: boolean = await this.commandRepo.createUser(dto);
    if (!isSaved) {
      throw new ImATeapotException();
    }
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
