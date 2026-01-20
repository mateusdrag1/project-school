import { PostRepository } from "../repositories/typeorm/post.repository";

export class EditPublicPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(
    id: string,
    data: {
      title?: string;
      content?: string;
      author?: string;
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
