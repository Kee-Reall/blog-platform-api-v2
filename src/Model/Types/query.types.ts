export type Direction = 'ASC' | 'DESC' | 'asc' | 'desc';

export interface AbstractFilter {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: Direction;
}

export interface BlogFilter extends AbstractFilter {
  searchNameTerm?: string;
}

export type PostFilter = AbstractFilter;

export interface UsersForAdminFilter extends AbstractFilter {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  banStatus?: string;
}

export interface UsersForBloggerFilter extends AbstractFilter {
  searchLoginTerm?: string;
}

export type CommentsFilter = AbstractFilter;

export type BanQuery = 'all' | 'banned' | 'notBanned';
