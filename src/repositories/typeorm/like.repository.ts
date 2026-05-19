import { Repository } from "typeorm";
import { Like } from "../../entities/like.entity";
import { AppDataSource } from "../../lib/typeorm/typeorm";
import { ILikeRepository } from "../comment-like.repository.interface";

export class TypeORMLikeRepository implements ILikeRepository {
  private repository: Repository<Like>;

  constructor() {
    this.repository = AppDataSource.getRepository(Like);
  }

  async create(data: Partial<Like>): Promise<Like> {
    const like = this.repository.create(data);
    return await this.repository.save(like);
  }

  async delete(postId: string, userId?: string): Promise<void> {
    if (userId) {
      await this.repository.delete({ postId, userId });
    }
  }

  async countByPostId(postId: string): Promise<number> {
    return await this.repository.count({ where: { postId } });
  }

  async findByPostAndUser(
    postId: string,
    userId: string,
  ): Promise<Like | null> {
    return await this.repository.findOne({ where: { postId, userId } });
  }
}
