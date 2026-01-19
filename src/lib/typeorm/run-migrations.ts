import { AppDataSource } from "./typeorm";

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  console.log("✅ Migrations executed");
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
