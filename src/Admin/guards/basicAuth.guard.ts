import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { appConfig } from '../../Infrastructure';

export class BasicAuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException();
    }
    const auth: Array<unknown> = authorization.split(' ');
    if (!Array.isArray(auth)) {
      throw new UnauthorizedException();
    }
    const [type, auth64] = auth;
    const [login, password] = Buffer.from(auth64 ?? '', 'base64')
      .toString('ascii')
      .split(':');
    const [adminLogin, adminPassword] = appConfig.basicAuthPair;
    const isAdmin: boolean =
      login === adminLogin && password === adminPassword && type === 'Basic';
    if (!isAdmin) {
      throw new UnauthorizedException();
    }
    return isAdmin;
  }
}
