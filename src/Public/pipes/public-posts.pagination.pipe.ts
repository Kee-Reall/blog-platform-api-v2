import { PipeTransform } from '@nestjs/common';
import { PaginationConfigPipe } from '../../Base';
import { IPaginationConfig } from '../../Model';

class PostsPagination
  extends PaginationConfigPipe
  implements IPaginationConfig
{
  constructor(query: object) {
    super(query);
  }
}

export class PublicPostsPaginationPipe implements PipeTransform {
  public transform(value: object) {
    return new PostsPagination(value);
  }
}
