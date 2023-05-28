export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostCreateModel = PostInputModel & { blogId: string };

export type PostLogicModel = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
  createdAt: Date;
};

export type PostPresentationModel = Omit<
  PostLogicModel,
  '_id' | 'id' | 'blogId' | 'createdAt'
> & {
  id: string;
  blogId: string;
  createdAt: string;
};
