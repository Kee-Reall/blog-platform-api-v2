import { Nullable } from './helpers.types';
import { SessionJwtMeta } from './auth.metadata.types';

export type DbRowMessage = { field: string };
export interface OperationResult<Payload = any> {
  status: boolean;
  payload: Payload;
}

export type CreationResult = OperationResult<{ id: number }>;

export type UserForLogin = {
  id: number;
  hash: string;
  isBanned: boolean;
  isConfirmed: boolean;
  isDeleted: boolean;
};

export type SessionsFromDb = Pick<SessionJwtMeta, 'userId' | 'updateDate'>;
