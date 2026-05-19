import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserRole } from "./models/user.interface";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password_hash!: string;

  @Column({
    type: "enum",
    enum: ["student", "teacher"],
    default: "student",
  })
  role!: UserRole;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
