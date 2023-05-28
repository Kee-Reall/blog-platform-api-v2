import { PipeTransform } from '@nestjs/common';
import { BlogsPagination } from '../../Base';

export class PublicBlogsPaginationPipe implements PipeTransform {
  public transform(value: object) {
    return new BlogsPagination(value);
  }
}
