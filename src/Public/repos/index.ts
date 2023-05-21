import { PublicCommandRepository } from './command.repository';
import { PublicQueryRepository } from './query.repository';

export const repos = [PublicCommandRepository, PublicQueryRepository];

export * from './query.repository';
export * from './command.repository';
