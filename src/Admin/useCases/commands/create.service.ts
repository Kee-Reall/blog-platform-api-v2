import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorMessage, UserInputModel } from '../../../Model';
import { MessageENUM } from '../../../Base';
import { AdminQueryRepository } from '../../repos/admin-query.repository';

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
    const user = await this.queryRepo.getUserByLoginOrEmail();
    console.log(user)
    return;
  }

  private generateNotUniqueError(fields: string[]): {
    errorsMessages: ErrorMessage[];
  } {
    const errorsMessages = fields.map((field) => ({
      message: MessageENUM.ALREADY_EXISTS,
      field,
    }));
    return { errorsMessages };
  }
}
