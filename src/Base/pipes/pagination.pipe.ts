import { AbstractFilter, Direction, IPaginationConfig } from '../../Model';

export class PaginationConfigPipe implements IPaginationConfig {
  public limit: number;
  public shouldSkip: number;
  public sortDirection: Direction = 'DESC';
  public sortBy: string;
  public pageNumber: number;
  protected constructor(query: AbstractFilter) {
    console.log(query);
    this.pageNumber = Math.floor(+query.pageNumber || 1);
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    }
    this.limit = Math.floor(+query.pageSize || 10);
    if (this.limit < 1) {
      this.limit = 10;
    }
    this.shouldSkip = this.limit * (this.pageNumber - 1);
    this.sortDirection = query.sortDirection === 'asc' ? 'ASC' : 'DESC';
    this.sortBy = <string>query.sortBy || 'createdAt';
  }
}
