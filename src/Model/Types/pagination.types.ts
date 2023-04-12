export type SortDirection = 'asc' | 'desc';

export type PaginatedOutput<Data> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Data[];
};

export type PaginationDigits = {
  totalCount: number;
  limit: number;
  pageNumber: number;
};
