import { superAdminQueryHandlers } from './query';
import { superAdminCommandHandlers } from './commands';

export * from './query';
export * from './commands';

export const useCases = [
  ...superAdminCommandHandlers,
  ...superAdminQueryHandlers,
];
