import { Nullable } from './helpers.types';

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
};
