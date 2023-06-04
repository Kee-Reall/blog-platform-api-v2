import { IPaginationConfig, PaginatedOutput } from '../../Model';
import { InjectionToken } from '@nestjs/common';

export const PAGINATE_FUNC: InjectionToken = 'PAGINATE_FUNC';

export type PaginateFunc<T> = (
  config: IPaginationConfig,
  totalCount: number,
  items: T[],
) => PaginatedOutput<T>;

export function paginate<T>(
  config: IPaginationConfig,
  totalCount: number,
  items: T[],
): PaginatedOutput<T> {
  return {
    pagesCount: Math.ceil(totalCount / config.limit),
    page: config.pageNumber,
    pageSize: config.limit,
    totalCount,
    items,
  };
}
