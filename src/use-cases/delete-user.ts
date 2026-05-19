import { ResourceNotFoundError } from "../errors/domain.errors";
import { IUserRepository } from "../repositories/user.repository.interface";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new ResourceNotFoundError("User not found");

    await this.userRepository.delete(id);
  }
}
