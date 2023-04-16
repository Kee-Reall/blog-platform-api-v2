import { JwtService } from '@nestjs/jwt';
import { MessageENUM } from '../../../Base';
import { appConfig } from '../../../Infrastructure';
import { SessionJwtMeta, SessionsFromDb, TokenPair } from '../../../Model';

export abstract class SecurityService {
  protected generateTokenPair(
    jwtService: JwtService,
    meta: SessionJwtMeta,
  ): TokenPair {
    const [accessTokenLiveTime, refreshTokenLiveTime] =
      appConfig.jwtLifeTimePair;
    const accessToken = jwtService.sign(
      { userId: meta.userId },
      {
        expiresIn: accessTokenLiveTime,
        secret: appConfig.jwtSecret,
        algorithm: 'HS512',
      },
    );
    const refreshToken = jwtService.sign(meta, {
      expiresIn: refreshTokenLiveTime,
      secret: appConfig.jwtSecret,
      algorithm: 'HS512',
    });
    return { accessToken, refreshToken };
  }

  protected checkValidMeta(
    meta: SessionJwtMeta,
    session: SessionsFromDb,
  ): boolean {
    const isSameUser = session.userId === meta.userId;
    const isSameDate = meta.updateDate === session.updateDate;
    return isSameUser && isSameDate;
  }

  protected generateNotAllowMessage(field) {
    return {
      errorsMessages: [{ message: MessageENUM.NOT_ALLOW, field }],
    };
  }
}
