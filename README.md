# Project School – Blog API

API REST para um sistema de blogging educacional, desenvolvida com **Node.js**, **Express**, **TypeScript**, **TypeORM** e **PostgreSQL**.  
O projeto utiliza **migrations** para versionamento do banco de dados e **seed** para popular dados iniciais.

---

## 📌 Tecnologias

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL

---

## ✅ Requisitos

- Node.js **22+**
- Docker e Docker Compose
- npm

---

## 🌱 Variáveis de Ambiente

O projeto **não utiliza dotenv**. As variáveis são lidas diretamente de `process.env`.

```bash
PORT=3000
NODE_ENV=development

DATABASE_USER=admin
DATABASE_PASSWORD=school
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=school
```

⚠️ **Dentro do Docker Compose**, o `DATABASE_HOST` deve ser `db`.

---

## 🚀 Rodando com Docker (recomendado)

### 1️⃣ Subir API + Postgres

```bash
docker compose up --build
```

A API ficará disponível em:

```
http://localhost:3000
```

---

### 2️⃣ Rodar migrations (obrigatório)

```bash
docker compose exec api npm run db:migrate
```

---

### 3️⃣ Rodar seed (dados iniciais)

```bash
docker compose exec api npm run db:seed
```

---

## 🧑‍💻 Rodando local (Node) + Postgres no Docker

### 1️⃣ Subir apenas o banco

```bash
docker compose up -d db
```

---

### 2️⃣ Instalar dependências

```bash
npm ci
```

---

### 3️⃣ Rodar migrations

```bash
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
npm run db:migrate
```

---

### 4️⃣ Rodar seed

```bash
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
npm run db:seed
```

---

### 5️⃣ Subir API em modo desenvolvimento

```bash
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
PORT=3000 \
NODE_ENV=development \
npm run start:dev
```

---

## 🔁 Atualizando o projeto

### Alterou apenas código

```bash
docker compose up --build -d
```

### Alterou dependências (`package.json`)

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

---

## 🧨 Reset total do banco (⚠️ apaga dados)

```bash
docker compose down -v
docker compose up --build -d
docker compose exec api npm run db:migrate
docker compose exec api npm run db:seed
```

---

## 🗃️ Migrations (TypeORM)

### Executar migrations

```bash
npm run db:migrate
```

### Reverter última migration

```bash
npm run db:revert
```

### Regra importante

O **nome da classe da migration** deve terminar com um **timestamp JavaScript em milissegundos (13 dígitos)**.

Exemplo correto:

- Arquivo: `1768826864000-CreatePostsTable.ts`
- Classe: `CreatePostsTable1768826864000`

---

## 🌱 Seed

### Executar seed

```bash
npm run db:seed
```

O seed popula posts iniciais e evita duplicação de dados.

---

## 🧪 Testes (Jest)

### Rodar testes

```bash
npm test
```

### Rodar em watch

```bash
npm run test:watch
```

---

## 📡 Endpoints

### 📄 Listar posts (alunos)

```http
GET /posts
```

---

### 📄 Ler post

```http
GET /posts/:id
```

---

### ✍️ Criar post (docentes)

```http
POST /posts
```

```json
{
  "title": "Título",
  "content": "Conteúdo do post",
  "author": "Autor",
  "published": true
}
```

---

### ✏️ Editar post

```http
PUT /posts/:id
```

---

### ❌ Excluir post

```http
DELETE /posts/:id
```

---

### 🔍 Buscar posts

```http
GET /posts/search?q=palavra
```

---

## 🧾 Scripts Disponíveis

- `npm run start:dev` – servidor em modo desenvolvimento
- `npm run build` – build do projeto
- `npm run start` – roda a versão buildada
- `npm run db:migrate` – executa migrations
- `npm run db:revert` – reverte última migration
- `npm run db:seed` – executa seed
- `npm test` – executa testes

---

## 🆘 Troubleshooting

### API não conecta no banco (Docker)

Dentro do compose:

```bash
DATABASE_HOST=db
```

### Ver logs

```bash
docker compose logs -f api
docker compose logs -f db
```
