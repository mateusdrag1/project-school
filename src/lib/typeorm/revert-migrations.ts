import { AppDataSource } from "./typeorm";

async function run() {
  await AppDataSource.initialize();
  await AppDataSource.undoLastMigration();
  console.log("✅ Last migration reverted");
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
