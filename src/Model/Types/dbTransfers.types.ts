import { SessionJwtMeta } from './auth.metadata.types';
import { BlogPresentationModel } from './blogs.types';
import { PostPresentationModel } from './posts.types';

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
export interface UserStatus {
  isDeleted: boolean;
  isBanned: boolean;
  isConfirmed: boolean;
}

export type ExtendedInfo = {
  ownerId: number;
  isOwnerDeleted: boolean;
  isBlogBanned: boolean;
  isOwnerBanned: boolean;
  isDeleted: boolean;
};

export type BlogWithExtended = BlogPresentationModel & {
  extendedInfo: ExtendedInfo;
};

export type PostWithExtended = Omit<PostPresentationModel, 'blogName'> & {
  id: number;
  blogId: number;
  extendedInfo: ExtendedInfo & { isBlogDeleted: boolean };
};
