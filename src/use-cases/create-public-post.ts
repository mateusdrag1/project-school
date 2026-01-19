import { PostRepository } from "../repositories/typeorm/post.repository";

export class CreatePublicPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(data: {
    title: string;
    content: string;
    author: string;
    published: boolean;
  }) {
    const newPost = await this.postRepository.create(data);
    return newPost;
  }
}
