export type PostCategory =
  | "Educação"
  | "Tecnologia"
  | "Comunicados"
  | "Eventos"
  | "Dicas de Estudo";

export interface IPost {
  id?: string;
  title: string;
  description: string;
  content: string;
  author: string;
  category: PostCategory;
  published?: boolean;
  comments?: any[];
  likesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
