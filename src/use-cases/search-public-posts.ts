import { PostRepository } from "../repositories/typeorm/post.repository";

export class SearchPublicPostsUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(query: string) {
    const posts = await this.postRepository.search(query);
    return posts;
  }
}
