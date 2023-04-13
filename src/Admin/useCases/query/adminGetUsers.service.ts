import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  PaginatedOutput,
  UserPresentationModel,
  UsersForAdminFilter,
  WithBanInfo,
} from '../../../Model';

export class GetPaginatedUsers {
  constructor(public input?: UsersForAdminFilter) {}
}

@QueryHandler(GetPaginatedUsers)
export class AdminGetUsersHandler implements IQueryHandler<GetPaginatedUsers> {
  public async execute(
    query: GetPaginatedUsers,
  ): Promise<PaginatedOutput<WithBanInfo<UserPresentationModel>>> {
    // return this.queryRepo.getPaginatedUsers(config);
    return;
  }
}
