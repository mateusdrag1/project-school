import { IPost } from "../entities/models/post.interface";
import { IPostRepository } from "../repositories/post.repository.interface";

export class ReadPublicPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: string): Promise<IPost | null> {
    return await this.postRepository.findById(id);
  }
}
