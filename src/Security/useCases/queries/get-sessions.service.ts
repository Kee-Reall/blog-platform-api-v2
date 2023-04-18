import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityService } from '../base';
import { AuthQueryRepository } from '../../repos';
import { NullablePromise, SessionJwtMeta } from '../../../Model';

export class GetSessions implements SessionJwtMeta {
  deviceId: number;
  updateDate: string;
  userId: number;
  constructor(dto: SessionJwtMeta) {
    this.deviceId = dto.deviceId;
    this.updateDate = dto.updateDate;
    this.userId = dto.userId;
  }
}

@QueryHandler(GetSessions)
export class GetSessionsUseCase
  extends SecurityService
  implements IQueryHandler<GetSessions>
{
  constructor(private repo: AuthQueryRepository) {
    super();
  }
  public async execute(query: GetSessions): NullablePromise<any> {
    const session = await this.repo.getSession(query.deviceId);
    if (!session) {
      throw new UnauthorizedException();
    }
    if (!this.checkValidMeta(query, session)) {
      throw new UnauthorizedException();
    }
    return await this.repo.getSessions(query.userId);
  }
}
