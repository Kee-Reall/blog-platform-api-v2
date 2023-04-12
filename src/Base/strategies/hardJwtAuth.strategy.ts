import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { appConfig } from '../../Infrastructure';
import { AccessTokenPayload, UserAccessDTO } from '../../Model';

type TYpeThisRepoLater = any;

@Injectable()
export class HardJwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private mdl: TYpeThisRepoLater) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    });
  }

  public async validate(payload: object): Promise<UserAccessDTO> {
    if (!payload.hasOwnProperty('userId')) {
      throw new UnauthorizedException();
    }
    const { userId } = payload as AccessTokenPayload;
    const user = await this.mdl.nullableFindById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.banInfo.isBanned) {
      throw new UnauthorizedException();
    }
    return { userId };
  }
}
