import { PostCategory } from "../entities/models/post.interface";
import { PostRepository } from "../repositories/typeorm/post.repository";

export class CreatePublicPostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(data: {
    title: string;
    description: string;
    content: string;
    author: string;
    category: PostCategory;
    published: boolean;
  }) {
    const newPost = await this.postRepository.create(data);
    return newPost;
  }
}
