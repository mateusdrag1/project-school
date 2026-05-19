import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../env";
import { InvalidCredentialsError } from "../errors/domain.errors";
import { IUserRepository } from "../repositories/user.repository.interface";

const authenticateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthenticateUserRequest = z.infer<typeof authenticateUserSchema>;

interface AuthenticateUserResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    const { email, password } = authenticateUserSchema.parse(request);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "1d",
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
