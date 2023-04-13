import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminQueryRepository {
  public async getUserByLoginOrEmail() {
    return 'got id';
  }
}
