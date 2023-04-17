import { addMinutes } from 'date-fns';
import { v4 as genUUIDv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SecurityService } from '../base';
import { EmailService } from '../../email';
import { VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class ResendConfirmCode {
  constructor(public email: string) {}
}

@CommandHandler(ResendConfirmCode)
export class ResendingConfirmationCodeUseCase
  extends SecurityService
  implements ICommandHandler<ResendConfirmCode>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    private mailServ: EmailService,
  ) {
    super();
  }
  public async execute(command: ResendConfirmCode): VoidPromise {
    const status = await this.queryRepo.getUserStatusByEmail(command.email);
    const isStatusValid = this.checkStatus(status);
    if (!isStatusValid) {
      throw new BadRequestException(this.generateNotAllowMessage('email'));
    }
    const code = genUUIDv4();
    const isMailSent = await this.mailServ.sendConfirmation(
      command.email,
      code,
    );
    if (!isMailSent) {
      throw new ServiceUnavailableException();
    }
    const newTime = addMinutes(new Date(), 15);
    this.commandRepo
      .updateConfirmationCode(command.email, code, newTime)
      .catch((e) => console.error(e));
    return;
  }
}
