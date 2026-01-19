import { IPost } from "../entities/models/post.interface";

export interface IPostRepository {
  create(data: IPost): Promise<IPost>;

  findAll(): Promise<IPost[]>;

  findPublic(): Promise<IPost[]>;

  findById(id: string): Promise<IPost | null>;

  update(id: string, data: Partial<IPost>): Promise<IPost>;

  delete(id: string): Promise<void>;

  search(keyword: string): Promise<IPost[]>;
}
