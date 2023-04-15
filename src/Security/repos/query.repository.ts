import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthQueryRepository {
  public async getUserByLoginOrEmail(loginOrEmail: string) {
    return;
  }
}
