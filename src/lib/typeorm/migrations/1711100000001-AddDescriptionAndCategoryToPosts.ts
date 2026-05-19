import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionAndCategoryToPosts1711100000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "post_category_enum" AS ENUM ('Educação', 'Tecnologia', 'Comunicados', 'Eventos', 'Dicas de Estudo');
    `);

    await queryRunner.query(`
      ALTER TABLE "posts" 
      ADD "description" varchar(255) NOT NULL DEFAULT '',
      ADD "category" "post_category_enum" NOT NULL DEFAULT 'Educação';
    `);

    // Remove defaults after adding columns if you don't want them for future inserts
    await queryRunner.query(`
      ALTER TABLE "posts" 
      ALTER COLUMN "description" DROP DEFAULT,
      ALTER COLUMN "category" DROP DEFAULT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "description"`);
    await queryRunner.query(`DROP TYPE "post_category_enum"`);
  }
}
