import { Post } from "../../entities/post.entity";
import { AppDataSource } from "./typeorm";

async function seedPosts() {
  await AppDataSource.initialize();

  const postRepository = AppDataSource.getRepository(Post);

  const count = await postRepository.count();
  if (count > 0) {
    console.log("⚠️ Posts already seeded");
    await AppDataSource.destroy();
    return;
  }

  const posts = postRepository.create([
    {
      title: "Bem-vindos ao Blog Escolar",
      content:
        "Este é o primeiro post do blog. Aqui serão divulgados avisos, conteúdos educacionais e novidades importantes.",
      author: "Coordenação",
      published: true,
    },
    {
      title: "Calendário Acadêmico 2026",
      content:
        "O calendário acadêmico de 2026 já está disponível. Fiquem atentos às datas de provas e eventos.",
      author: "Secretaria",
      published: true,
    },
    {
      title: "Manutenção do Sistema",
      content:
        "O sistema ficará indisponível neste final de semana para manutenção preventiva.",
      author: "Equipe de TI",
      published: true,
    },
    {
      title: "Post em Rascunho",
      content:
        "Este post ainda não está publicado e não deve aparecer para alunos.",
      author: "Professor João",
      published: false,
    },
  ]);

  await postRepository.save(posts);

  console.log("✅ Posts seed executed successfully");

  await AppDataSource.destroy();
}

seedPosts().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
