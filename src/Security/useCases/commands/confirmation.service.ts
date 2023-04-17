import { isAfter } from 'date-fns';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { SecurityService } from '../base';
import { VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class ConfirmAccount {
  constructor(public code: string) {}
}

@CommandHandler(ConfirmAccount)
export class ConfirmationUseCase
  extends SecurityService
  implements ICommandHandler<ConfirmAccount>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
  ) {
    super();
  }
  public async execute(command: ConfirmAccount): VoidPromise {
    const result = await this.queryRepo.getUserStatusByCode(command.code);
    if (!result) {
      throw new BadRequestException(this.generateNotAllowMessage('code'));
    }
    const [status, confirmDate] = result;
    const isStatusValid = this.checkStatus(status);
    if (!isStatusValid) {
      throw new BadRequestException(this.generateNotAllowMessage('code'));
    }
    if (isAfter(new Date(), confirmDate)) {
      throw new BadRequestException(this.generateNotAllowMessage('code'));
    }
    const isSaved: boolean = await this.commandRepo.confirmUser(command.code);
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
