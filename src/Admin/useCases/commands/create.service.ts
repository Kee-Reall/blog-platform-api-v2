import { hash as genHash, genSalt } from 'bcrypt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { MessageENUM, CreationContract } from '../../../Base';
import { AdminCommandRepository, AdminQueryRepository } from '../../repos';
import {
  DbRowMessage,
  ErrorMessage,
  UserInputModel,
  UserCreationModel,
  WithBanInfo,
  UserPresentationModel,
} from '../../../Model';

export class CreateUser implements UserInputModel {
  public email: string;
  public login: string;
  public password: string;

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
