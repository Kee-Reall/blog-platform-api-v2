import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { SecurityService } from '../base';
import {
  Nullable,
  SessionJwtMeta,
  SessionsFromDb,
  TokenPair,
} from '../../../Model';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';

export class Refresh {
  public ip: Nullable<string> = null;
  constructor(public meta: SessionJwtMeta, ip: string) {
    if (ip) {
      this.ip = ip;
    }
  }
}

@CommandHandler(Refresh)
export class RefreshUseCase
  extends SecurityService
  implements ICommandHandler<Refresh>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    protected jwtService: JwtService,
  ) {
    super();
  }
  public async execute(command: Refresh): Promise<TokenPair> {
    const session: Nullable<SessionsFromDb> = await this.queryRepo.getSession(
      command.meta.deviceId,
    );
    if (!session) {
      throw new UnauthorizedException();
    }
    const notValidMeta = !this.checkValidMeta(command.meta, session);
    if (notValidMeta) {
      throw new UnauthorizedException();
    }
    const newMeta: SessionJwtMeta = await this.commandRepo.updateSession(
      command.meta.deviceId,
      command.ip,
    );
    console.log(newMeta);
    if (!newMeta) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(this.jwtService, newMeta);
    return;
  }
}
