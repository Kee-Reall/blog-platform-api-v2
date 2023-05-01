import { Direction as SortDirection } from './query.types';
import { Nullable } from './helpers.types';

export interface IPaginationConfig {
  sortBy: string;
  shouldSkip: number;
  limit: number;
  sortDirection: SortDirection;
  pageNumber: number;
}

export interface IUserPaginationConfig extends IPaginationConfig {
  login: Nullable<string>;
  email: Nullable<string>;
  banStatus: Nullable<boolean>;
}

export interface IBlogPaginationConfig extends IPaginationConfig {
  searchNameTerm: string;
}

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
