import { PostRepository } from "../repositories/typeorm/post.repository";

export class DeletePublicPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}
  async execute(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
