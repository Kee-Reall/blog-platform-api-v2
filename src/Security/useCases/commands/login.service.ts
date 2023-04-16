import { JwtService } from '@nestjs/jwt';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImATeapotException, UnauthorizedException } from '@nestjs/common';
import { AuthCommandRepository, AuthQueryRepository } from '../../repos';
import { SecurityService } from '../base';
import { UserLoginModel, WithClientMeta } from '../../../Model';
import { compare } from 'bcrypt';

export class Login implements WithClientMeta<UserLoginModel> {
  public loginOrEmail: string;
  public password: string;
  constructor(public agent: string, public ip: string, dto: UserLoginModel) {
    this.loginOrEmail = dto.loginOrEmail;
    this.password = dto.password;
  }
}

@CommandHandler(Login)
export class LoginUseCase
  extends SecurityService
  implements ICommandHandler<Login>
{
  constructor(
    private queryRepo: AuthQueryRepository,
    private commandRepo: AuthCommandRepository,
    protected jwtService: JwtService,
  ) {
    super();
  }
  public async execute(command: Login): Promise<any> {
    const user = await this.queryRepo.getUserByLoginOrEmail(
      command.loginOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const cantLogin: boolean =
      !user.isConfirmed || user.isBanned || user.isDeleted;
    if (cantLogin) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await compare(command.password, user.hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const session = await this.commandRepo.createSession(
      user.id,
      command.agent,
      command.ip,
    );
    if (!session) {
      throw new ImATeapotException();
    }
    return this.generateTokenPair(this.jwtService, session);
  }
}
