import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { PostCategory } from "./models/post.interface";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "varchar", length: 120 })
  author!: string;

  @Column({
    type: "enum",
    enum: [
      "Educação",
      "Tecnologia",
      "Comunicados",
      "Eventos",
      "Dicas de Estudo",
    ],
  })
  category!: PostCategory;

  @Column({ type: "boolean", default: true })
  published!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes!: Like[];
}
