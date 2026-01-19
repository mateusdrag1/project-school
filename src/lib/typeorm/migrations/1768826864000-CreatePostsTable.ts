import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreatePostsTable1768826864000 implements MigrationInterface {
  name = "CreatePostsTable1768826864000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "title",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "content",
            type: "text",
            isNullable: false,
          },
          {
            name: "author",
            type: "varchar",
            length: "120",
            isNullable: false,
          },
          {
            name: "published",
            type: "boolean",
            isNullable: false,
            default: "true",
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      "posts",
      new TableIndex({
        name: "IDX_POSTS_PUBLISHED_CREATED_AT",
        columnNames: ["published", "created_at"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("posts", "IDX_POSTS_PUBLISHED_CREATED_AT");
    await queryRunner.dropTable("posts", true);
  }
}
