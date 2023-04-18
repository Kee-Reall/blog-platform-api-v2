import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { PaginationConfigPipe } from '../../Base/pipes/pagination.pipe';
import { IUserPaginationConfig, UsersForAdminFilter } from '../../Model';

export class UserPagination
  extends PaginationConfigPipe
  implements IUserPaginationConfig
{
  public login: string;
  public email: string;
  public banStatus: boolean;
  constructor(query: UsersForAdminFilter) {
    super(query);
    this.login = query.searchLoginTerm ?? null;
    this.email = query.searchEmailTerm ?? null;
    if (query.banStatus === 'banned') {
      this.banStatus = true;
    } else if (query.banStatus === 'notBanned') {
      this.banStatus = false;
    } else {
      this.banStatus = null;
    }
  }
}

export class UserPaginationPipe implements PipeTransform {
  transform(value: object, metadata: ArgumentMetadata) {
    return new UserPagination(value);
  }
}
