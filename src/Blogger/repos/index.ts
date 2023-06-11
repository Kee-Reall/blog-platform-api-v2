import { BloggerQueryRepository } from './query.repository';
import { BloggerCommandRepository } from './command.repository';

export default [BloggerQueryRepository, BloggerCommandRepository];

export * from './query.repository';
export * from './command.repository';
