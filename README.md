# Build RAG web app using LlamaIndexTS

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

## You can run the web app locally

```bash
pnpm install
pnpm run dev
```

## Author

[himself65(Alex Yang)](https://github.com/himself65)

## LICENSE

MIT
