import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import {
  Nullable,
  SessionJwtMeta,
  SessionsFromDb,
  VoidPromise,
} from '../../../Model';

export class Logout implements SessionJwtMeta {
  deviceId: number;

  updateDate: string;
  userId: number;
  constructor(meta: SessionJwtMeta) {
    this.deviceId = meta.deviceId;
    this.updateDate = meta.updateDate;
    this.userId = meta.userId;
  }
}

@CommandHandler(Logout)
export class LogoutUseCase
  extends SecurityService
  implements ICommandHandler<Logout>
{
  constructor(
    private commandRepo: AuthCommandRepository,
    private queryRepo: AuthQueryRepository,
  ) {
    super();
  }

  public async execute(command: Logout): VoidPromise {
    const session: Nullable<SessionsFromDb> = await this.queryRepo.getSession(
      command.deviceId,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    const notValidMeta = !this.checkValidMeta(command, session);
    if (notValidMeta) {
      throw new UnauthorizedException();
    }
    const isDeleted = await this.commandRepo.killSession(command);
    if (!isDeleted) {
      throw new ImATeapotException();
    }
    return;
  }
}
