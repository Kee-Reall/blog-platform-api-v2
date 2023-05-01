import { IPaginationConfig } from '../../../Model';

export class PaginateQuery implements IPaginationConfig {
  public sortBy;
  public shouldSkip;
  public limit;
  public sortDirection;
  public pageNumber;

  constructor(input: IPaginationConfig) {
    this.sortBy = input.sortBy;
    this.shouldSkip = input.shouldSkip;
    this.limit = input.limit;
    this.sortDirection = input.sortDirection;
    this.pageNumber = input.pageNumber;
  }
}
