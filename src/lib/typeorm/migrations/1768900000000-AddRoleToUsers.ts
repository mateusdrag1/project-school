import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1768900000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('student', 'teacher')
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "role" "users_role_enum" NOT NULL DEFAULT 'student'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
  }
}
