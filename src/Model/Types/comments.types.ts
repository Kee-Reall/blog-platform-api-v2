
export type CommentatorInfoType = {
  userId: number;
  userLogin: string;
};

export type CommentsLogicModel = {
  id: number;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: Date;
  postId: number;
};

export type CommentPresentationModel = Pick<CommentsLogicModel, 'content'> & {
  id: string;
  postId: string;
  createdAt: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type CommentInputModel = Pick<CommentsLogicModel, 'content'>;
