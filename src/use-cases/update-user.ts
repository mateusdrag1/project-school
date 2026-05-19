import { hash } from "bcryptjs";
import { z } from "zod";
import { EmailAlreadyInUseError } from "../errors/domain.errors";
import { ResourceNotFoundError } from "../errors/domain.errors";
import { IUserRepository } from "../repositories/user.repository.interface";

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

type UpdateUserRequest = z.infer<typeof updateUserSchema>;

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserRequest) {
    const { name, email, password } = updateUserSchema.parse(data);

    const user = await this.userRepository.findById(id);
    if (!user) throw new ResourceNotFoundError("User not found");

    if (email && email !== user.email) {
      const existing = await this.userRepository.findByEmail(email);
      if (existing) throw new EmailAlreadyInUseError();
    }

    const updatePayload: Record<string, unknown> = {};
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;
    if (password) updatePayload.password_hash = await hash(password, 6);

    const updated = await this.userRepository.update(id, updatePayload);

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    };
  }
}
