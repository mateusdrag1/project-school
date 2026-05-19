import { hash } from "bcryptjs";
import { z } from "zod";
import { IUserRepository } from "../repositories/user.repository.interface";

const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterUserRequest = z.infer<typeof registerUserSchema>;

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: RegisterUserRequest) {
    const { name, email, password } = registerUserSchema.parse(request);

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error("User with this email already exists");
    }

    const password_hash = await hash(password, 6);

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
