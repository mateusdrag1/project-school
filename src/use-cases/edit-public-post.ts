import { PostCategory } from "../entities/models/post.interface";
import { PostRepository } from "../repositories/typeorm/post.repository";

export class EditPublicPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(
    id: string,
    data: {
      title?: string;
      description?: string;
      content?: string;
      author?: string;
      category?: PostCategory;
      published?: boolean;
    },
  ) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      return null;
    }
    const updatedPost = await this.postRepository.update(id, data);
    return updatedPost;
  }
}
