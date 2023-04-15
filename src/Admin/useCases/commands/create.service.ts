import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MessageENUM } from '../../../Base';
import { AdminQueryRepository } from '../../repos/admin-query.repository';
import {
  DbRowMessage,
  ErrorMessage,
  UserInputModel,
  UserCreationModel,
  WithBanInfo,
  UserPresentationModel,
} from '../../../Model';
import { AdminCommandRepository } from '../../repos/admin-command.repository';
import { hash as genHash, genSalt } from 'bcrypt';
import { CreationContract } from "../../../Base/classes/contracts/creation.contract";

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

@CommandHandler(CreateUser)
export class CreateUserUseCase implements ICommandHandler<CreateUser> {
  constructor(
    private queryRepo: AdminQueryRepository,
    private commandRepo: AdminCommandRepository,
  ) {}
  public async execute(
    command: CreateUser,
  ): Promise<WithBanInfo<UserPresentationModel>> {
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
    const contract: CreationContract = await this.commandRepo.createUser(dto);
    console.log(contract);
    if (contract.isFailed()) {
      throw new ImATeapotException();
    }
    return await this.queryRepo.getUser(contract.getId());
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
