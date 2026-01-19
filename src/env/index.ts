import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_USER: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_PORT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid Enviroment Variables", z.treeifyError(_env.error));

  throw new Error("Invalid Enviroment Variables");
}

export const env = _env.data;
