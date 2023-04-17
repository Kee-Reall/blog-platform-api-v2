import { BadRequestException, ImATeapotException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { RecoveryInputModel, VoidPromise } from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import { isAfter } from 'date-fns';
import { genSalt, hash as genHash } from 'bcrypt';

export class ChangePassword implements RecoveryInputModel {
  newPassword: string;
  recoveryCode: string;
  constructor(dto: RecoveryInputModel) {
    this.recoveryCode = dto.recoveryCode;
    this.newPassword = dto.newPassword;
  }
}

@CommandHandler(ChangePassword)
export class PasswordChangingUseCase
  extends SecurityService
  implements ICommandHandler<ChangePassword>
{
  private rc = 'recoveryCode';
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
  ) {
    super();
  }
  public async execute(command: ChangePassword): VoidPromise {
    const dto = await this.queryRepo.getUserMetaByRecoveryCode(
      command.recoveryCode,
    );
    if (!dto) {
      throw new BadRequestException(this.generateNotAllowMessage(this.rc));
    }
    const [status, expirationDate, userId] = dto;
    const canChange: boolean =
      status.isConfirmed && !status.isDeleted && !status.isBanned;
    if (!canChange) {
      throw new BadRequestException(this.generateNotAllowMessage(this.rc));
    }
    const isTimeExpired: boolean = isAfter(new Date(), expirationDate);
    if (isTimeExpired) {
      throw new BadRequestException(this.generateNotAllowMessage(this.rc));
    }
    const hash = await genHash(command.newPassword, await genSalt(8));
    const isSaved: boolean = await this.commandRepo.setNewPassword(
      userId,
      hash,
    );
    if (!isSaved) {
      throw new ImATeapotException();
    }
    return;
  }
}
