export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogLogicModel = {
  id?: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
};

export type BlogPresentationModel = Omit<BlogLogicModel, 'id' | '_id'> & {
  id: string | number;
  createdAt: string;
};

export type BlogCreationModel = BlogInputModel & { userId: string | number };

export type BlogOwnerInfoModel = {
  userId: number;
  userLogin: string;
};

export type WithOwnerInfo<T> = T & BlogOwnerInfoModel;
