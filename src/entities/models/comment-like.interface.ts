export interface IComment {
  id?: string;
  postId: string;
  userId?: string;
  authorName?: string;
  content: string;
  createdAt?: Date;
}

export interface ILike {
  id?: string;
  postId: string;
  userId?: string;
  createdAt?: Date;
}
