import { ILike, Repository } from "typeorm";
import { IPost } from "../../entities/models/post.interface";
import { Post } from "../../entities/post.entity";
import { AppDataSource } from "../../lib/typeorm/typeorm";
import { IPostRepository } from "../post.repository.interface";

export class PostRepository implements IPostRepository {
  private readonly repository: Repository<Post>;

  constructor() {
    this.repository = AppDataSource.getRepository(Post);
  }

  async create(data: IPost): Promise<IPost> {
    const post = this.repository.create(data);
    return await this.repository.save(post);
  }

  async findAll(): Promise<IPost[]> {
    return await this.repository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findPublic(): Promise<IPost[]> {
    return await this.repository.find({
      where: { published: true },
      order: { createdAt: "DESC" },
    });
  }

  async findById(id: string): Promise<IPost | null> {
    const post = await this.repository.findOne({
      where: { id },
      relations: ["comments", "comments.user", "likes"],
    });

    if (!post) return null;

    return {
      ...post,
      likesCount: post.likes?.length || 0,
    } as IPost;
  }

  async update(id: string, data: Partial<IPost>): Promise<IPost> {
    const post = await this.findById(id);

    if (!post) {
      throw new Error("Post not found");
    }

    this.repository.merge(post as Post, data);
    return await this.repository.save(post as Post);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async search(keyword: string): Promise<IPost[]> {
    return await this.repository.find({
      where: [
        { title: ILike(`%${keyword}%`), published: true },
        { content: ILike(`%${keyword}%`), published: true },
      ],
      order: { createdAt: "DESC" },
    });
  }
}
