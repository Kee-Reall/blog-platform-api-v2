import { Nullable } from './helpers.types';

export type DbRowMessage = { field: string };
export interface OperationResult<Payload = any> {
  status: boolean;
  payload: Payload;
}

export type CreationResult = OperationResult<{ id: number }>;
