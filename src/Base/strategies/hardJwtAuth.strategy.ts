import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { appConfig } from '../../Infrastructure';
import { AccessTokenPayload, UserAccessDTO } from '../../Model';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TablesENUM } from '../../Helpres/SQL';

@Injectable()
export class HardJwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectDataSource() private ds: DataSource) {
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
    const result = await this.ds.query(
      `
SELECT ab.status AS ban,u."isDeleted" FROM ${TablesENUM.USERS_BAN_LIST_BY_ADMIN} AS ab
RIGHT JOIN ${TablesENUM.USERS} AS u ON u.id = ab."userId"
WHERE u.id = $1
`,
      [userId],
    );
    console.log(result);
    if (result.length < 0) {
      throw new UnauthorizedException();
    }
    const isBanned = result[0].ban;
    const isDeleted = result[0].isDeleted;
    if (isBanned || isDeleted) {
      throw new UnauthorizedException();
    }
    return { userId };
  }
}
