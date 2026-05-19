import { z } from "zod";
import { ILikeRepository } from "../repositories/comment-like.repository.interface";

const toggleLikeSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

type ToggleLikeRequest = z.infer<typeof toggleLikeSchema>;

export class ToggleLikeUseCase {
  constructor(private likeRepository: ILikeRepository) {}

  async execute(request: ToggleLikeRequest) {
    const { postId, userId } = toggleLikeSchema.parse(request);

    // Se for anônimo, apenas adiciona o like (não temos como dar toggle sem ID de usuário)
    if (!userId) {
      return await this.likeRepository.create({ postId });
    }

    // Se estiver logado, faz o toggle (se já deu like, remove, senão adiciona)
    const existingLike = await this.likeRepository.findByPostAndUser(
      postId,
      userId,
    );

    if (existingLike) {
      await this.likeRepository.delete(postId, userId);
      return { liked: false };
    }

    await this.likeRepository.create({ postId, userId });
    return { liked: true };
  }
}
