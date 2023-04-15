import { JwtPayload } from 'jsonwebtoken';

export interface SessionMetadata {
  userId: number;
  deviceId: string;
  updateDate: Date;
  ip: Array<string | 'undetected'>;
  title?: string;
}

export interface SessionJwtMeta {
  userId: number;
  deviceId: string;
  updateDate: string;
}

export interface AccessTokenMeta {
  userId: string;
}

export interface SoftGuardMeta extends AccessTokenMeta {
  userId: string | null;
}

export interface AccessTokenPayload extends JwtPayload, AccessTokenMeta {}

export type UserAccessDTO = Pick<AccessTokenPayload, 'userId'>;

export interface RefreshTokenPayload extends JwtPayload, SessionJwtMeta {}

export interface SessionFilter<T = string> {
  userId: T;
  deviceId: T;
}

export interface RefreshTokenDbResponse {
  userId: number;
  deviceId: number;
  updateDate: Date;
}

export interface UpdateRefreshTokenMeta {
  userId: string;
  deviceId: string;
  ip: string | null;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
