import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "post_id", type: "uuid" })
  postId!: string;

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId?: string;

  @Column({ name: "author_name", type: "varchar", nullable: true })
  authorName?: string;

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "post_id" })
  post!: Post;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;
}
