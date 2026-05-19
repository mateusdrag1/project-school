import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateCommentsAndLikesTables1711100000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "comments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "post_id",
            type: "uuid",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "author_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "content",
            type: "text",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "likes",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "post_id",
            type: "uuid",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys("comments", [
      new TableForeignKey({
        columnNames: ["post_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "posts",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      }),
    ]);

    await queryRunner.createForeignKeys("likes", [
      new TableForeignKey({
        columnNames: ["post_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "posts",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("likes");
    await queryRunner.dropTable("comments");
  }
}
