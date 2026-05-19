import { Repository } from "typeorm";
import { Comment } from "../../entities/comment.entity";
import { AppDataSource } from "../../lib/typeorm/typeorm";
import { ICommentRepository } from "../comment-like.repository.interface";

export class TypeORMCommentRepository implements ICommentRepository {
  private repository: Repository<Comment>;

  constructor() {
    this.repository = AppDataSource.getRepository(Comment);
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const comment = this.repository.create(data);
    return await this.repository.save(comment);
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return await this.repository.find({
      where: { postId },
      order: { createdAt: "DESC" },
      relations: ["user"],
    });
  }
}
