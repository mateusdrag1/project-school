import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { UserRole } from "../../entities/models/user.interface";
import { AppDataSource } from "../../lib/typeorm/typeorm";
import { IUserRepository } from "../user.repository.interface";

export class TypeORMUserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.repository.find({
      where: { role },
      order: { created_at: "ASC" },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    return (await this.repository.findOne({ where: { id } })) as User;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
