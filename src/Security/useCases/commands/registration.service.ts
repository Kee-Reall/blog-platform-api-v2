import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as genUUIDv4 } from 'uuid';
import {
  BadRequestException,
  ImATeapotException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { EmailService } from '../../email';
import { CreationContract, MessageENUM } from '../../../Base';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import {
  DbRowMessage,
  ErrorMessage,
  UserCreationModel,
  UserInputModel,
  VoidPromise,
} from '../../../Model';
import { genSalt, hash as genHash } from 'bcrypt';
import { addMinutes } from 'date-fns';

export class Register {
  email: string;

  login: string;
  password: string;
  constructor(dto: UserInputModel) {
    this.email = dto.email;
    this.login = dto.login;
    this.password = dto.password;
  }
}

@CommandHandler(Register)
export class RegistrationUseCase implements ICommandHandler<Register> {
  constructor(
    private commandRepo: AuthCommandRepository,
    private queryRepo: AuthQueryRepository,
    private mailServ: EmailService,
  ) {}

  public async execute(command: Register): VoidPromise {
    const { login, email, password } = command;
    const errors = await this.queryRepo.checkUniqueUser(
      command.login,
      command.email,
    );
    if (errors.length > 0) {
      throw new BadRequestException(this.generateNotUniqueError(errors));
    }
    const dto: Required<UserCreationModel> = {
      login: command.login,
      email: command.email,
      hash: await genHash(command.password, await genSalt(8)),
      code: genUUIDv4(),
      date: addMinutes(new Date(), 15), // code Becomes not valid after 15 minutes
    };
    const contract: CreationContract = await this.commandRepo.createUser(dto);
    if (contract.isFailed()) {
      throw new ImATeapotException();
    }
    const isSent = await this.mailServ.sendConfirmation(
      email,
      contract.getCode(),
    );
    if (!isSent) {
      await this.commandRepo.killUser(contract.getId());
      throw new ServiceUnavailableException();
    }
    return;
    // const user = new this.mdl({ login, email });
    // const [isUnique, fieldsArray] = await user.isFieldsUnique();
    // if (!isUnique) {
    //   throw new BadRequestException(this.generateError(fieldsArray));
    // }
    // await user.setHash(password);
    // const isSaved: boolean = await this.repo.saveUserAfterRegistry(user);
    // if (!isSaved) {
    //   throw new ImATeapotException();
    // }
    // const isMailSent = await this.mailServ.sendConfirmation(
    //   user.email,
    //   user.confirmation.code,
    // );
    // if (!isMailSent) {
    //   await user.killYourself();
    //   throw new ServiceUnavailableException();
    // }
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
