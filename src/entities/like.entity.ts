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

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "post_id", type: "uuid" })
  postId!: string;

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "post_id" })
  post!: Post;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;
}
