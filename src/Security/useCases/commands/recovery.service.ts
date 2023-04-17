import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../email';
import { UserStatus, VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import { v4 as genUUIDv4 } from 'uuid';
import { addMinutes } from 'date-fns';

export class SetRecovery {
  constructor(public email: string) {}
}

@CommandHandler(SetRecovery)
export class SetRecoveryCodeUseCase implements ICommandHandler<SetRecovery> {
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    private mailServ: EmailService,
  ) {}
  public async execute(command: SetRecovery): VoidPromise {
    const status: UserStatus = await this.queryRepo.getUserStatusByEmail(
      command.email,
    );
    if (!status || status.isDeleted || status.isBanned) {
      return;
    }
    if (!status.isConfirmed) {
      return;
    }
    const newDate = addMinutes(new Date(), 15);
    const recoveryCode = genUUIDv4();
    await this.commandRepo.setRecoveryStatus(
      command.email,
      recoveryCode,
      newDate,
    );
    this.mailServ.sendRecoveryInfo(command.email, recoveryCode); // don't wait for this Promise
    return;
  }
}
