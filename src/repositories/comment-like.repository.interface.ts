import { Comment } from "../entities/comment.entity";
import { Like } from "../entities/like.entity";

export interface ICommentRepository {
  create(data: Partial<Comment>): Promise<Comment>;
  findByPostId(postId: string): Promise<Comment[]>;
}

export interface ILikeRepository {
  create(data: Partial<Like>): Promise<Like>;
  delete(postId: string, userId?: string): Promise<void>;
  countByPostId(postId: string): Promise<number>;
  findByPostAndUser(postId: string, userId: string): Promise<Like | null>;
}
