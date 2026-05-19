# Documentação Técnica — Project School Blog API

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Estrutura de Diretórios](#4-estrutura-de-diretórios)
5. [Modelagem do Banco de Dados](#5-modelagem-do-banco-de-dados)
6. [Camadas da Aplicação](#6-camadas-da-aplicação)
7. [Endpoints da API](#7-endpoints-da-api)
8. [Autenticação e Segurança](#8-autenticação-e-segurança)
9. [Tratamento de Erros](#9-tratamento-de-erros)
10. [Configuração de Ambiente](#10-configuração-de-ambiente)
11. [Migrations e Seed](#11-migrations-e-seed)
12. [Estratégia de Testes](#12-estratégia-de-testes)
13. [Pipeline CI/CD](#13-pipeline-cicd)
14. [Docker e Infraestrutura](#14-docker-e-infraestrutura)
15. [Decisões de Design](#15-decisões-de-design)
16. [Guia de Desenvolvimento](#16-guia-de-desenvolvimento)

---

## 1. Visão Geral

O **Project School Blog API** é uma API REST desenvolvida para suportar uma plataforma de blog educacional. O sistema permite que docentes publiquem conteúdo categorizado e que alunos interajam com as postagens por meio de comentários e curtidas, com suporte tanto a usuários autenticados quanto anônimos.

**Características principais:**

- Gerenciamento completo de posts com categorias predefinidas
- Autenticação JWT para docentes (criação, edição e exclusão de posts)
- Comentários abertos: autenticados e anônimos
- Sistema de curtidas com comportamento de toggle para usuários autenticados
- Busca textual em título e conteúdo
- Versionamento de banco via migrations
- Suite de testes de integração com Jest e Supertest
- Pipeline CI/CD no GitHub Actions
- Imagem Docker publicada no GitHub Container Registry

---

## 2. Stack Tecnológica

### Runtime e Linguagem

| Tecnologia | Versão | Justificativa |
|---|---|---|
| Node.js | 22+ | LTS com suporte nativo a módulos ES e performance aprimorada |
| TypeScript | 5.9.3 | Tipagem estática, autocompletion e contratos de interface |

### Framework e Servidor

| Tecnologia | Versão | Justificativa |
|---|---|---|
| Express | 5.2.1 | Framework HTTP minimalista e amplamente adotado; versão 5 com suporte a async/await nativo |

### Banco de Dados e ORM

| Tecnologia | Versão | Justificativa |
|---|---|---|
| PostgreSQL | 16 | Banco relacional robusto com suporte a UUID nativo e extensões |
| TypeORM | 0.3.28 | ORM maduro para TypeScript com suporte a decorators, migrations e relacionamentos |
| pg | 8.17.1 | Driver nativo PostgreSQL para Node.js |

### Autenticação e Segurança

| Tecnologia | Versão | Justificativa |
|---|---|---|
| jsonwebtoken | 9.0.3 | Padrão de mercado para tokens stateless |
| bcryptjs | 3.0.3 | Hash seguro de senhas com salt adaptativo |

### Validação

| Tecnologia | Versão | Justificativa |
|---|---|---|
| Zod | 4.3.5 | Validação com inferência de tipos TypeScript; elimina duplicação de tipos/schemas |

### Testes

| Tecnologia | Versão | Justificativa |
|---|---|---|
| Jest | 30.2.0 | Framework de testes com suporte a mocks, coverage e watch mode |
| ts-jest | 29.4.6 | Preprocessor para TypeScript sem step de build |
| Supertest | 7.2.2 | Testes HTTP end-to-end sem necessidade de subir o servidor |

### Build e Containerização

| Tecnologia | Versão | Justificativa |
|---|---|---|
| tsup | 8.5.1 | Bundler leve e rápido baseado em esbuild |
| tsx | 4.21.0 | Execução de TypeScript em desenvolvimento sem compilação |
| Docker | - | Portabilidade e isolamento de ambiente |
| Docker Compose | - | Orquestração local de serviços (API + banco) |

---

## 3. Arquitetura do Sistema

### Visão Macro

```
┌──────────────────────────────────────────────────────────────┐
│                        Cliente HTTP                          │
│              (Browser, Mobile App, Postman)                  │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                     Express Application                       │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │    CORS     │  │ ensureAuth   │  │  globalErrorHandler │  │
│  │ Middleware  │  │ Middleware   │  │    Middleware       │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Routes Layer                       │   │
│  │   auth.route  │  post routes  │  comment-like.route  │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │                 Controllers Layer                     │   │
│  │  (Parsing HTTP, delegação para Use Cases, resposta)  │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │                  Use Cases Layer                      │   │
│  │      (Lógica de negócio, validação com Zod)          │   │
│  └─────────────────────┬────────────────────────────────┘   │
│                        │                                     │
│  ┌─────────────────────▼────────────────────────────────┐   │
│  │               Repositories Layer                     │   │
│  │          (Interfaces + Implementações TypeORM)        │   │
│  └─────────────────────┬────────────────────────────────┘   │
└───────────────────────-┼─────────────────────────────────────┘
                         │ TypeORM / SQL
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16                              │
│         users │ posts │ comments │ likes                     │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo de uma Requisição

```
HTTP Request
  │
  ├─► CORS Middleware
  │
  ├─► ensureAuthenticated (rotas protegidas)
  │       └─ Verifica JWT → extrai userId → req.user
  │
  ├─► Route Handler
  │       └─ Registra endpoint + injeta dependências
  │
  ├─► Controller.handle(req, res, next)
  │       ├─ Extrai dados do request (body, params, query)
  │       ├─ Instancia Repository (TypeORM)
  │       ├─ Instancia Use Case (com repository injetado)
  │       └─ Chama useCase.execute()
  │
  ├─► Use Case.execute()
  │       ├─ Valida input com Zod Schema
  │       ├─ Aplica regras de negócio
  │       ├─ Chama repository para acesso a dados
  │       └─ Retorna resultado ou lança domain error
  │
  ├─► Repository
  │       ├─ Executa queries via TypeORM
  │       └─ Retorna entidades
  │
  └─► globalErrorHandler (se erro for lançado)
          └─ Mapeia erro → código HTTP → resposta JSON
```

### Padrão Arquitetural

O projeto adota os princípios da **Clean Architecture** adaptados para a realidade de uma API Node.js:

- **Separação de responsabilidades**: cada camada tem uma única responsabilidade
- **Inversão de dependência**: use cases dependem de interfaces de repositório, não de implementações concretas
- **Testabilidade**: use cases podem ser testados isoladamente com repositórios em memória
- **Independência de framework**: a lógica de negócio (use cases) não conhece Express

---

## 4. Estrutura de Diretórios

```
2-project/
├── src/
│   ├── @types/
│   │   └── express.d.ts              # Extensão do tipo Request do Express (req.user)
│   │
│   ├── entities/                     # Entidades TypeORM (modelos do banco)
│   │   ├── user.entity.ts
│   │   ├── post.entity.ts
│   │   ├── comment.entity.ts
│   │   ├── like.entity.ts
│   │   └── models/                   # Interfaces TypeScript das entidades
│   │       ├── user.interface.ts
│   │       ├── post.interface.ts
│   │       └── comment-like.interface.ts
│   │
│   ├── env/
│   │   └── index.ts                  # Leitura e validação das variáveis de ambiente via Zod
│   │
│   ├── errors/
│   │   └── domain.errors.ts          # Classes de erro de domínio personalizadas
│   │
│   ├── http/
│   │   ├── controllers/              # Handlers HTTP
│   │   │   ├── auth/
│   │   │   │   ├── register-user.ts
│   │   │   │   └── authenticate-user.ts
│   │   │   └── post/
│   │   │       ├── create-public-post.ts
│   │   │       ├── list-public-posts.ts
│   │   │       ├── read-public-post.ts
│   │   │       ├── search-public-posts.ts
│   │   │       ├── edit-public-post.ts
│   │   │       ├── delete-public-post.ts
│   │   │       ├── create-comment.ts
│   │   │       └── toggle-like.ts
│   │   └── middlewares/
│   │       ├── ensure-authenticated.ts  # Guard JWT
│   │       └── error-handler.ts         # Error handler global
│   │
│   ├── lib/
│   │   └── typeorm/
│   │       ├── typeorm.ts               # DataSource configuration
│   │       ├── migrations/              # Migrations versionadas
│   │       │   ├── 1711100000000-CreateUsersTable.ts
│   │       │   ├── 1711100000001-AddDescriptionAndCategoryToPosts.ts
│   │       │   ├── 1711100000002-CreateCommentsAndLikesTables.ts
│   │       │   └── 1768826864000-CreatePostsTable.ts
│   │       ├── run-migrations.ts
│   │       ├── revert-migrations.ts
│   │       └── seed.ts
│   │
│   ├── repositories/                    # Contratos e implementações de acesso a dados
│   │   ├── user.repository.interface.ts
│   │   ├── post.repository.interface.ts
│   │   ├── comment-like.repository.interface.ts
│   │   └── typeorm/
│   │       ├── user.repository.ts
│   │       ├── post.repository.ts
│   │       ├── comment.repository.ts
│   │       └── like.repository.ts
│   │
│   ├── routes/                          # Registro de rotas Express
│   │   ├── auth.route.ts
│   │   ├── health.route.ts
│   │   ├── list-public-posts.ts
│   │   ├── read-public-post.ts
│   │   ├── create-public-post.ts
│   │   ├── edit-public-post.ts
│   │   ├── delete-public-post.ts
│   │   ├── search-public-posts.ts
│   │   └── comment-like.route.ts
│   │
│   ├── use-cases/                       # Lógica de negócio
│   │   ├── register-user.ts
│   │   ├── authenticate-user.ts
│   │   ├── create-public-post.ts
│   │   ├── list-public-posts.ts
│   │   ├── read-public-post.ts
│   │   ├── search-public-posts.ts
│   │   ├── edit-public-post.ts
│   │   ├── delete-public-post.ts
│   │   ├── create-comment.ts
│   │   └── toggle-like.ts
│   │
│   ├── main.ts                          # Configuração do app Express
│   └── index.ts                         # Entry point (inicializa DB e HTTP server)
│
├── tests/
│   └── routes/
│       ├── health.spec.ts
│       ├── list-posts.spec.ts
│       ├── create-post.spec.ts
│       ├── read-post.spec.ts
│       ├── edit-post.spec.ts
│       ├── delete-post.spec.ts
│       └── search-post.spec.ts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                       # Pipeline de CI (testes + build)
│       └── docker.yml                   # Build e push de imagem Docker
│
├── Dockerfile                           # Build multi-stage
├── docker-compose.yml                   # Orquestração local
├── jest.config.ts
├── jest.setup.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Modelagem do Banco de Dados

### Diagrama Entidade-Relacionamento

```
┌─────────────────────────────────┐
│              users              │
├─────────────────────────────────┤
│ id           UUID  PK           │
│ name         VARCHAR            │
│ email        VARCHAR  UNIQUE    │
│ password_hash VARCHAR           │
│ created_at   TIMESTAMP          │
└──────────────┬──────────────────┘
               │ 1
               │
        ┌──────┴──────┐
        │             │
        │ N           │ N
┌───────▼──────┐  ┌───▼──────────────────────────────────┐
│   comments   │  │                posts                  │
├──────────────┤  ├───────────────────────────────────────┤
│ id      UUID │  │ id           UUID  PK                 │
│ post_id UUID │◄─┤ title        VARCHAR(200)             │
│ user_id UUID │  │ description  VARCHAR(255)             │
│ author_name  │  │ content      TEXT                     │
│ content TEXT │  │ author       VARCHAR(120)             │
│ created_at   │  │ category     ENUM                     │
└──────────────┘  │ published    BOOLEAN  default: true   │
                  │ created_at   TIMESTAMPTZ               │
                  │ updated_at   TIMESTAMPTZ               │
                  └──────────────────────────┬────────────┘
                                             │ 1
                                             │ N
                                   ┌─────────▼────────┐
                                   │      likes        │
                                   ├──────────────────┤
                                   │ id      UUID  PK │
                                   │ post_id UUID  FK │
                                   │ user_id UUID  FK │
                                   │ created_at       │
                                   └──────────────────┘
```

### Detalhamento das Tabelas

#### `users`

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | UUID | PK | Gerado via `pgcrypto` (`gen_random_uuid()`) |
| `name` | VARCHAR | NOT NULL | Nome do usuário |
| `email` | VARCHAR | NOT NULL, UNIQUE | Email de login |
| `password_hash` | VARCHAR | NOT NULL | Hash bcrypt da senha |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |

#### `posts`

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | UUID | PK | Gerado via `gen_random_uuid()` |
| `title` | VARCHAR(200) | NOT NULL | Título do post |
| `description` | VARCHAR(255) | NOT NULL | Resumo do post |
| `content` | TEXT | NOT NULL | Corpo do post |
| `author` | VARCHAR(120) | NOT NULL | Nome do autor |
| `category` | ENUM | NOT NULL | Uma das 5 categorias |
| `published` | BOOLEAN | NOT NULL, DEFAULT TRUE | Visibilidade pública |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data de publicação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Última atualização |

**Categorias disponíveis:** `Educação`, `Tecnologia`, `Comunicados`, `Eventos`, `Dicas de Estudo`

**Índice:** `(published, created_at)` — otimiza a listagem de posts publicados ordenados por data.

#### `comments`

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | UUID | PK | — |
| `post_id` | UUID | FK → posts.id, ON DELETE CASCADE | Post relacionado |
| `user_id` | UUID | FK → users.id, ON DELETE SET NULL, NULLABLE | Usuário autenticado |
| `author_name` | VARCHAR | NULLABLE | Nome para comentários anônimos |
| `content` | TEXT | NOT NULL | Corpo do comentário |
| `created_at` | TIMESTAMP | NOT NULL | — |

#### `likes`

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | UUID | PK | — |
| `post_id` | UUID | FK → posts.id, ON DELETE CASCADE | Post curtido |
| `user_id` | UUID | FK → users.id, ON DELETE SET NULL, NULLABLE | Usuário autenticado |
| `created_at` | TIMESTAMP | NOT NULL | — |

---

## 6. Camadas da Aplicação

### 6.1 Entities (`src/entities/`)

Classes TypeORM decoradas que representam as tabelas do banco. Definem:
- Mapeamento coluna ↔ campo TypeScript
- Relacionamentos (`@OneToMany`, `@ManyToOne`)
- Valores padrão e tipos

As interfaces em `models/` (ex.: `IPost`, `IUser`) são os contratos de tipo puros, usados nos use cases e repositories sem depender do TypeORM.

### 6.2 Repositories (`src/repositories/`)

**Interface** (`*.repository.interface.ts`): define o contrato que o use case conhece.

```
IPostRepository
  ├── findAll(): Promise<IPost[]>
  ├── findById(id): Promise<IPost | null>
  ├── findBySearch(query): Promise<IPost[]>
  ├── create(data): Promise<IPost>
  ├── update(id, data): Promise<IPost>
  └── delete(id): Promise<void>
```

**Implementação TypeORM** (`typeorm/*.repository.ts`): concretiza o contrato usando o `DataSource` e o `EntityManager` do TypeORM.

Este padrão permite substituir a implementação (ex.: banco em memória para testes) sem alterar a lógica de negócio.

### 6.3 Use Cases (`src/use-cases/`)

Cada use case é uma classe com um único método `execute()`. Responsabilidades:

1. Receber um DTO de entrada tipado
2. Validar com schema Zod
3. Aplicar regras de negócio
4. Chamar o repository necessário
5. Retornar um resultado tipado ou lançar um `DomainError`

**Exemplo — `CreatePublicPostUseCase`:**

```
Input: { title, description, content, author, category, published }
  └─► Valida schema Zod
  └─► Chama postRepository.create(data)
  └─► Retorna { post: IPost }
```

**Exemplo — `ToggleLikeUseCase`:**

```
Input: { postId, userId? }
  └─► Se userId presente: busca like existente
      ├─► Se existe: remove (unlike)
      └─► Se não existe: cria (like)
  └─► Se userId ausente: cria like anônimo
  └─► Retorna { liked: boolean }
```

### 6.4 Controllers (`src/http/controllers/`)

Fazem a ponte entre o mundo HTTP e os use cases:

1. Extrai dados do `req` (body, params, query, user)
2. Instancia repository e use case
3. Chama `useCase.execute()`
4. Formata e envia a resposta HTTP
5. Captura erros e repassa para o `next()` do Express

### 6.5 Routes (`src/routes/`)

Registram os endpoints no app Express, aplicam middlewares por rota e importam os controllers correspondentes. Funcionam como ponto central de configuração de cada endpoint.

### 6.6 Middlewares (`src/http/middlewares/`)

**`ensureAuthenticated`**
```
Authorization: Bearer <token>
  └─► jwt.verify(token, JWT_SECRET)
      ├─► Sucesso: req.user = { sub: userId }; next()
      └─► Falha: res.status(401).json({ message: 'Unauthorized' })
```

**`globalErrorHandler`**
```
Error
  ├─► ZodError → 400 + { message, errors: [detalhes dos campos] }
  ├─► ResourceNotFoundError → 404 + { message }
  ├─► InvalidCredentialsError → 401 + { message }
  └─► Unknown Error → 500 + { message: 'Internal server error' }
```

---

## 7. Endpoints da API

### Autenticação

#### `POST /register`

Cria um novo usuário.

**Request Body:**
```json
{
  "name": "Maria Silva",
  "email": "maria@escola.com",
  "password": "minhasenha123"
}
```

**Response `201`:**
```json
{
  "id": "uuid",
  "name": "Maria Silva",
  "email": "maria@escola.com"
}
```

---

#### `POST /login`

Autentica um usuário e retorna JWT.

**Request Body:**
```json
{
  "email": "maria@escola.com",
  "password": "minhasenha123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@escola.com"
  }
}
```

**Erros:** `401 InvalidCredentialsError`

---

### Posts

#### `GET /posts`

Lista todos os posts publicados, ordenados por data decrescente.

**Response `200`:**
```json
[
  {
    "id": "uuid",
    "title": "Título do Post",
    "description": "Resumo do post",
    "content": "Conteúdo completo...",
    "author": "Prof. João",
    "category": "Tecnologia",
    "published": true,
    "created_at": "2026-05-19T12:00:00.000Z",
    "updated_at": "2026-05-19T12:00:00.000Z"
  }
]
```

---

#### `GET /posts/:id`

Retorna um post completo com comentários e curtidas.

**Response `200`:**
```json
{
  "id": "uuid",
  "title": "Título",
  "content": "Conteúdo...",
  "comments": [...],
  "likes": [...],
  "likeCount": 5
}
```

**Erros:** `404 ResourceNotFoundError`

---

#### `GET /posts/search?q=palavra`

Busca posts publicados por palavra-chave no título ou conteúdo (case-insensitive).

**Query Params:** `q` — termo de busca

**Response `200`:** array de posts (mesmo formato do GET /posts)

---

#### `POST /posts`

Cria um novo post. Requer autenticação.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Como aprender TypeScript",
  "description": "Guia prático para iniciantes",
  "content": "TypeScript é uma linguagem...",
  "author": "Prof. Ana",
  "category": "Tecnologia",
  "published": true
}
```

**Categorias válidas:** `Educação` | `Tecnologia` | `Comunicados` | `Eventos` | `Dicas de Estudo`

**Response `201`:**
```json
{
  "message": "Post criado com sucesso",
  "post": { ... }
}
```

**Erros:** `400 ZodError`, `401 Unauthorized`

---

#### `PUT /posts/:id`

Atualiza um post existente. Todos os campos são opcionais. Requer autenticação.

**Headers:** `Authorization: Bearer <token>`

**Request Body (todos opcionais):**
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "content": "Novo conteúdo",
  "published": false
}
```

**Response `200`:**
```json
{
  "message": "Post atualizado com sucesso",
  "post": { ... }
}
```

**Erros:** `404 ResourceNotFoundError`, `401 Unauthorized`

---

#### `DELETE /posts/:id`

Remove um post. Requer autenticação.

**Headers:** `Authorization: Bearer <token>`

**Response `204`:** sem corpo

**Erros:** `400`, `401 Unauthorized`

---

### Comentários

#### `POST /comments`

Cria um comentário em um post. Suporta usuários autenticados e anônimos.

**Request Body:**
```json
{
  "postId": "uuid-do-post",
  "content": "Ótimo post!",
  "userId": "uuid-do-usuario",
  "authorName": null
}
```

> Para comentários anônimos: omita `userId` e forneça `authorName`.
> Para comentários autenticados: forneça `userId` (e opcionalmente o header JWT).

**Response `201`:**
```json
{
  "id": "uuid",
  "postId": "uuid",
  "userId": "uuid",
  "authorName": null,
  "content": "Ótimo post!",
  "created_at": "2026-05-19T12:00:00.000Z"
}
```

**Erros:** `400 ZodError` (quando nem userId nem authorName são fornecidos)

---

### Curtidas

#### `POST /likes`

Adiciona ou remove uma curtida (toggle). Para usuários anônimos, sempre adiciona.

**Request Body:**
```json
{
  "postId": "uuid-do-post",
  "userId": "uuid-do-usuario"
}
```

**Response `200`:**
```json
{
  "liked": true
}
```

> `liked: true` — curtida adicionada  
> `liked: false` — curtida removida (toggle para usuários autenticados)

---

### Health Check

#### `GET /health`

Verifica se a API está disponível.

**Response `200`:**
```json
{
  "status": "ok",
  "at": "2026-05-19T12:00:00.000Z"
}
```

---

## 8. Autenticação e Segurança

### Fluxo Completo

```
1. Registro
   POST /register
   ├─► Validação Zod (name, email, password)
   ├─► bcrypt.hash(password, salt=6)
   └─► Persiste user com password_hash

2. Login
   POST /login
   ├─► Busca user por email
   ├─► bcrypt.compare(password, user.password_hash)
   ├─► jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1d' })
   └─► Retorna token + dados do usuário

3. Requisição Autenticada
   Authorization: Bearer <token>
   ├─► ensureAuthenticated extrai token do header
   ├─► jwt.verify(token, JWT_SECRET)
   ├─► Decodifica payload: { sub: userId }
   ├─► req.user = { sub: userId }
   └─► Controller acessa req.user.sub para identificar o usuário
```

### Considerações de Segurança

- **Bcrypt salt rounds: 6** — balanceia segurança e performance; adequado para o contexto educacional
- **JWT com expiração de 1 dia** — tokens têm vida útil limitada
- **JWT_SECRET via variável de ambiente** — nunca hardcoded em produção
- **Senhas nunca retornadas** — `password_hash` é omitido de todas as respostas
- **SET NULL em user_id** — deleção de usuário não apaga conteúdo gerado (comentários, likes mantidos como anônimos)

---

## 9. Tratamento de Erros

### Hierarquia de Erros

```
Error
└── DomainError (src/errors/domain.errors.ts)
    ├── ResourceNotFoundError  → HTTP 404
    └── InvalidCredentialsError → HTTP 401

ZodError (gerado pelo Zod)          → HTTP 400
Unknown Error                        → HTTP 500
```

### Global Error Handler

O middleware `globalErrorHandler` é registrado como último middleware no Express e intercepta todos os erros repassados via `next(error)`:

```typescript
// Estrutura das respostas de erro
// 400 - Validação
{ "message": "Validation error", "errors": [{ "field": "email", "message": "Invalid email" }] }

// 401 - Credenciais inválidas
{ "message": "Invalid credentials" }

// 404 - Recurso não encontrado
{ "message": "Resource not found" }

// 500 - Erro desconhecido
{ "message": "Internal server error" }
```

---

## 10. Configuração de Ambiente

### Variáveis de Ambiente

A leitura é feita em `src/env/index.ts` com validação Zod na inicialização da aplicação. Se alguma variável obrigatória estiver ausente ou inválida, a aplicação falha imediatamente com mensagem descritiva.

| Variável | Tipo | Padrão | Obrigatório | Descrição |
|---|---|---|---|---|
| `NODE_ENV` | `development` \| `production` \| `test` | `development` | Não | Ambiente de execução |
| `PORT` | number | `3000` | Não | Porta HTTP |
| `DATABASE_USER` | string | — | Sim | Usuário PostgreSQL |
| `DATABASE_PASSWORD` | string | — | Sim | Senha PostgreSQL |
| `DATABASE_HOST` | string | — | Sim | Host do banco (`localhost` ou `db`) |
| `DATABASE_PORT` | number | — | Sim | Porta PostgreSQL (geralmente `5432`) |
| `DATABASE_NAME` | string | — | Sim | Nome do banco de dados |
| `JWT_SECRET` | string | `secret-key` | Não | Chave de assinatura JWT |

### Arquivos de Ambiente

- `.env` — desenvolvimento local
- `.env.test` — executado automaticamente pelos testes (via `jest.setup.ts`)

> O projeto **não usa dotenv** — as variáveis devem ser passadas via shell ou injetadas pelo ambiente de execução (Docker, CI, etc.).

---

## 11. Migrations e Seed

### Sistema de Migrations

O TypeORM controla o versionamento do schema via migrations. Cada migration tem um arquivo TypeScript com métodos `up()` (aplicar) e `down()` (reverter).

**Convenção de nomenclatura:**
```
<timestamp-13-digitos>-<NomeDaMigration>.ts
class NomeDaMigration<timestamp-13-digitos> {}
```

### Migrations Existentes

| Ordem | Arquivo | Descrição |
|---|---|---|
| 1 | `1711100000000-CreateUsersTable` | Cria tabela `users` com `pgcrypto` |
| 2 | `1711100000001-AddDescriptionAndCategoryToPosts` | Adiciona `description` e `category` em `posts` |
| 3 | `1711100000002-CreateCommentsAndLikesTables` | Cria tabelas `comments` e `likes` |
| 4 | `1768826864000-CreatePostsTable` | Cria tabela `posts` com índice em `(published, created_at)` |

### Seed

O script `src/lib/typeorm/seed.ts` popula dados iniciais verificando previamente se o banco já possui posts, evitando duplicação. Cria 4 posts de exemplo (3 publicados e 1 rascunho).

```bash
# Executar seed
npm run db:seed
# ou
docker compose exec api npm run db:seed
```

---

## 12. Estratégia de Testes

### Abordagem

Os testes são **de integração (end-to-end)** usando Supertest. Cada teste:
1. Conecta ao banco de testes real (`NODE_ENV=test`)
2. O TypeORM usa `synchronize: true` para criar o schema automaticamente (sem migrations)
3. Envia requisições HTTP reais ao app Express
4. Verifica o status code e o corpo da resposta

Esta abordagem garante que toda a pilha (controller → use case → repository → banco) funciona corretamente de ponta a ponta.

### Cobertura de Testes

| Arquivo de Teste | Endpoints Cobertos |
|---|---|
| `health.spec.ts` | `GET /health` |
| `list-posts.spec.ts` | `GET /posts` |
| `create-post.spec.ts` | `POST /posts` (autenticado + validações) |
| `read-post.spec.ts` | `GET /posts/:id` (sucesso + 404) |
| `edit-post.spec.ts` | `PUT /posts/:id` (campos parciais + 404) |
| `delete-post.spec.ts` | `DELETE /posts/:id` (sucesso + 404) |
| `search-post.spec.ts` | `GET /posts/search?q=` |

### Configuração Jest

```typescript
// jest.config.ts
{
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
}
```

### Comandos

```bash
npm test              # Execução única
npm run test:watch    # Modo watch (re-executa ao salvar)
```

---

## 13. Pipeline CI/CD

### Workflow de CI (`.github/workflows/ci.yml`)

**Gatilhos:** push e pull request para `main`

```
Trigger: push/PR → main
  │
  ├─► Job: test-and-build
  │     ├─► Checkout do código
  │     ├─► Setup Node.js 22 + cache npm
  │     ├─► Serviço PostgreSQL 16 (health check)
  │     ├─► npm ci
  │     ├─► npm run build
  │     └─► npm test (com variáveis de .env.test)
  │
  └─► Status: pass/fail reportado na PR
```

### Workflow de Docker (`.github/workflows/docker.yml`)

**Gatilhos:** push para `main` ou tags `v*.*.*`

```
Trigger: push → main | tag v*.*.*
  │
  ├─► Setup QEMU (multi-platform)
  ├─► Setup Docker Buildx
  ├─► Login no GitHub Container Registry (ghcr.io)
  └─► Build e Push da imagem
        Tags:
          - ghcr.io/<owner>/<repo>:<branch>
          - ghcr.io/<owner>/<repo>:<git-tag>
          - ghcr.io/<owner>/<repo>:<commit-sha>
```

---

## 14. Docker e Infraestrutura

### Dockerfile Multi-Stage

```dockerfile
# Stage 1: deps — instala dependências
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build — compila TypeScript
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: runtime — imagem final mínima
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "build/index.js"]
```

**Vantagens da abordagem multi-stage:**
- Imagem final não contém código TypeScript nem ferramentas de build
- Redução significativa do tamanho da imagem
- Separação clara entre ambiente de build e runtime

### Docker Compose

```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_HOST: db     # nome do serviço no compose
      ...
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: school
      POSTGRES_DB: school
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Detalhes:**
- `depends_on` com `condition: service_healthy` garante que a API só sobe após o banco estar pronto
- Volume `pgdata` persiste os dados entre reinicializações
- Health check do banco usa `pg_isready` para verificação real de conectividade

---

## 15. Decisões de Design

### Por que Clean Architecture?

A separação em camadas (entities → repositories → use cases → controllers) foi escolhida para:

- **Testabilidade**: use cases podem ser testados em isolamento com repositórios fake
- **Clareza de responsabilidade**: cada arquivo tem uma única função bem definida
- **Facilidade de manutenção**: alterações no banco (trocar TypeORM por Prisma, por exemplo) afetam apenas a camada de repositories

### Por que TypeORM com Migrations em vez de Prisma?

TypeORM foi escolhido por ser compatível com o padrão de decorators TypeScript, já estabelecido no contexto do projeto FIAP. As migrations versionadas oferecem controle preciso sobre alterações de schema em produção, ao contrário de `synchronize: true` que é perigoso em ambientes produtivos.

### Por que Express 5 e não Fastify?

Express 5 foi escolhido por familiaridade e vasta documentação. A versão 5 resolve o problema histórico de não propagar erros em handlers assíncronos, eliminando a necessidade de wrappers como `express-async-errors`.

### Por que Zod para validação?

Zod foi escolhido sobre `class-validator` porque:
- Gera tipos TypeScript automaticamente via `z.infer<>`, eliminando duplicação
- Funciona com objetos planos, sem necessidade de classes decoradas
- Erros granulares por campo, facilitando respostas de validação detalhadas

### Comentários e Likes Anônimos

A decisão de suportar interações anônimas reflete o contexto educacional: alunos não precisam de conta para deixar comentários ou curtidas, reduzindo fricção de adoção. A coluna `user_id` é nullable e o `author_name` é usado como fallback para identificação.

### ON DELETE CASCADE vs SET NULL

- `comments.post_id` e `likes.post_id`: **CASCADE** — faz sentido deletar interações junto com o post
- `comments.user_id` e `likes.user_id`: **SET NULL** — preserva o conteúdo gerado pelo usuário mesmo após a deleção da conta (histórico mantido)

### Por que sem dotenv?

A aplicação lê variáveis diretamente de `process.env` e valida via Zod na inicialização. Isso é mais alinhado com práticas de contêineres e cloud (12-factor app), onde as variáveis são injetadas pelo ambiente, não por arquivos.

---

## 16. Guia de Desenvolvimento

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- npm

### Configuração Inicial

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd 2-project

# 2. Instale as dependências
npm ci

# 3. Suba o banco via Docker
docker compose up -d db

# 4. Execute as migrations
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
JWT_SECRET=dev-secret \
npm run db:migrate

# 5. Execute o seed (opcional)
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
JWT_SECRET=dev-secret \
npm run db:seed

# 6. Inicie o servidor em modo desenvolvimento
DATABASE_USER=admin \
DATABASE_PASSWORD=school \
DATABASE_HOST=localhost \
DATABASE_PORT=5432 \
DATABASE_NAME=school \
PORT=3000 \
NODE_ENV=development \
JWT_SECRET=dev-secret \
npm run start:dev
```

**API disponível em:** `http://localhost:3000`

### Com Docker Compose (mais simples)

```bash
# Sobe tudo
docker compose up --build

# Migrations
docker compose exec api npm run db:migrate

# Seed
docker compose exec api npm run db:seed
```

### Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run start:dev` | Servidor em modo desenvolvimento (tsx, hot reload) |
| `npm run build` | Compila TypeScript para `/build` via tsup |
| `npm start` | Executa a versão compilada |
| `npm run db:migrate` | Aplica todas as migrations pendentes |
| `npm run db:revert` | Reverte a última migration |
| `npm run db:seed` | Popula dados iniciais |
| `npm test` | Executa a suite de testes |
| `npm run test:watch` | Testes em modo watch |

### Criando uma Nova Migration

```bash
# 1. Gere o timestamp atual (13 dígitos)
date +%s%3N

# 2. Crie o arquivo com o timestamp
# src/lib/typeorm/migrations/<timestamp>-NomeDaMigration.ts

# 3. A classe deve seguir o padrão:
export class NomeDaMigration<timestamp> implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> { ... }
  async down(queryRunner: QueryRunner): Promise<void> { ... }
}
```

### Reset Completo do Banco

```bash
# ATENÇÃO: apaga todos os dados
docker compose down -v
docker compose up --build -d
docker compose exec api npm run db:migrate
docker compose exec api npm run db:seed
```

### Monitoramento de Logs

```bash
docker compose logs -f api   # Logs da API
docker compose logs -f db    # Logs do PostgreSQL
```
