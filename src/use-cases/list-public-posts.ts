import { IPost } from "../entities/models/post.interface";
import { IPostRepository } from "../repositories/post.repository.interface";

export class ListPublicPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(): Promise<IPost[]> {
    return await this.postRepository.findPublic();
  }
}
