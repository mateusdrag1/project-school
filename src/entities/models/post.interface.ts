export interface IPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
