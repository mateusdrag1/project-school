import { Repository } from "typeorm";
import { AppDataSource } from "../../lib/typeorm/typeorm";
import { User } from "../../entities/user.entity";
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
    const user = await this.repository.findOne({ where: { email } });
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user;
  }
}
