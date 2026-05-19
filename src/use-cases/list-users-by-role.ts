import { UserRole } from "../entities/models/user.interface";
import { IUserRepository } from "../repositories/user.repository.interface";

export class ListUsersByRoleUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(role: UserRole) {
    const users = await this.userRepository.findByRole(role);
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
    }));
  }
}
