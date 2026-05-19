import { z } from "zod";
import { ICommentRepository } from "../repositories/comment-like.repository.interface";

const createCommentSchema = z
  .object({
    postId: z.string().uuid(),
    userId: z.string().uuid().optional(),
    authorName: z.string().min(2).optional(),
    content: z.string().min(1),
  })
  .refine((data) => data.userId || data.authorName, {
    message: "O nome é obrigatório para usuários não logados",
    path: ["authorName"],
  });

type CreateCommentRequest = z.infer<typeof createCommentSchema>;

export class CreateCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(request: CreateCommentRequest) {
    const data = createCommentSchema.parse(request);

    const comment = await this.commentRepository.create({
      postId: data.postId,
      userId: data.userId,
      authorName: data.userId ? undefined : data.authorName,
      content: data.content,
    });

    return comment;
  }
}
