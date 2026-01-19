import "reflect-metadata";
import { env } from "./env";
import { AppDataSource } from "./lib/typeorm/typeorm";
import { app } from "./main";

async function bootstrap() {
  await AppDataSource.initialize();
  console.log("Database connected");

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start application:", err);
  process.exit(1);
});
