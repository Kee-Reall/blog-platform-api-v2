import { BlogFilter, IBlogPaginationConfig } from '../../Model';
import { PaginationConfigPipe } from '../../Base/pipes/pagination.pipe';
import { PipeTransform } from '@nestjs/common';

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

export class BlogsForBloggerPaginationPipe implements PipeTransform {
  public transform(value: object) {
    return new BlogsPagination(value);
  }
}
