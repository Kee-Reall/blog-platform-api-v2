import { PaginationConfigPipe } from './pagination.pipe';
import { BlogFilter, IBlogPaginationConfig } from '../../Model';

export class BlogsPagination
  extends PaginationConfigPipe
  implements IBlogPaginationConfig
{
  public searchNameTerm: string;

  constructor(query: BlogFilter) {
    super(query);
    this.searchNameTerm = query.searchNameTerm ?? null;
  }
}
