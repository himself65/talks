# CityJS 2024

## `packages/slide`

[Slides](./packages/slide/README.md)

## `packages/www`

This package contains the web app for the RAG project.

It is built using:

- [Waku](https://github.com/dai-shi/waku) - ⛩️ The minimal React framework
- [LlamaIndexTS](https://github.com/run-llama/LlamaIndexTS) - 🦙📈 The data framework for LLM applications in TypeScript
- [Vercel AI SDK](https://sdk.vercel.ai/) - 🤖 The AI Toolkit for TypeScript
- [Postgres](https://www.postgresql.org/) - 🐘 The world's most advanced open source database, hosted
  on [Neon](https://www.neon.tech/)
- [LlamaCloud](https://cloud.llamaindex.ai) - 🦙🌩️ The new generation of managed parsing, ingestion, and retrieval
  services, designed to bring production-grade context-augmentation to your LLM and RAG applications
- [TipTap](https://tiptap.dev/) - 📝 The headless editor framework
- [Shadcn](https://shadcn.com/) - 🌈 Beautifully designed components

### Key Features

- LLM
  - Simple Chat
  - Retrieval Chat
  - Agent with tool call
  - Workflow for customizing the AI workflow
- React
  - Server Components / Server Function
  - Optimistic update
  - Streaming UI
  - Integration with a simple note-taking editor, LlamaIndexTS, and Vercel AI SDK
- Node.js
  - AsyncLocalStorage
  - Web Stream API

## Usage

### Requirements

- Node.js >= 20.x
- Environment Variables

  - `DATABASE_URL` - The Postgres database URL
  - `OPENAI_API_KEY` - The OpenAI API key
  - `LLAMA_CLOUD_API_KEY`(Optional) - The LlamaCloud API key

- SQL Setup

  You need to create a table before running the app.

  ```sql
  CREATE EXTENSION vector;
  CREATE TABLE notes (
    id serial not null primary key,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

### Development

```bash
pnpm install
pnpm run dev
```
