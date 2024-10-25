---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: Build RAG web app using LlamaIndexTS
remoteAssets: true
---

## Alex Yang

Member of Node.js, Jotai, Waku.

Working at LlamaIndex.

---

## What is RAG?

### Without RAG

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="./assets/00.excalidraw.json"
class="w-[600px]"
:darkMode="true"
/>

</div>

<v-click>
  <div class="flex flex-row gap-2 items-center">
    <div i-ph-warning-duotone text-orange text-xl /> Costly
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
    <div i-ph-warning-duotone text-orange text-xl /> Inaccurate
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
    <div i-ph-warning-duotone text-orange text-xl /> Slow
  </div>
</v-click>

---

## What is RAG?

### With RAG

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="./assets/01.excalidraw.json"
class="w-[600px]"
:darkMode="true"
/>

</div>

<v-click>
  <div class="flex flex-row gap-2 items-center">
     <div i-ph-check-circle-duotone text-green text-xl /> Cost-effective
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
    <div i-ph-check-circle-duotone text-green text-xl /> Accurate
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
    <div i-ph-check-circle-duotone text-green text-xl /> Fast
  </div>
</v-click>

---

## Load, Store, Query

````md magic-move
```ts
const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
```

```ts
const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
const retriever = vectorIndex.asRetriever({ similarityTopK: 3 });
```

```ts
const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
const retriever = vectorIndex.asRetriever({ similarityTopK: 3 });
const queryEngine = new RetrieverQueryEngine(retriever);
const response = await queryEngine.query({
  query: "What is the LlamaIndex?",
});
```
````

<v-click>
  That's it!
</v-click>
---

## Simple Chat Engine

````md magic-move
```ts
const chatHistory = new ChatMemoryBuffer({
  chatHistory: [
    {
      content: `/* your prompt ... */`,
      role: "system",
    },
  ],
});
```

```ts
const chatEngine = new SimpleChatEngine({
  llm,
  memory: chatHistory,
});
```

```ts
// REPL in Node.js
import readline from "node:readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const query = await rl.question("User: ");
  process.stdout.write("Assistant: ");
  const stream = await chatEngine.chat({ message: query, stream: true });
  for await (const chunk of stream) {
    process.stdout.write(chunk.response);
  }
  process.stdout.write("\n");
}
```
````

---

## Vector Store

Text -> Vector

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="./assets/02.excalidraw.json"
class="w-[600px]"
:darkMode="true"
/>

</div>

---

## Vector Store

```ts
import postgres from "postgres";
import { PGVectorStore } from "llamaindex/vector-store";

const sql = postgres(process.env.DATABASE_URL);
const vectorStore = new PGVectorStore({
  shouldConnect: false,
  client: sql,
});

vectorStore.add(documents);
```

---

## DEMO

<https://demo-cityjs.llamaindex.ai>

- React Server Component / React Server Function (not Next.js)
- Waku
- TipTap Editor
- Vecerl AI SDK
- Shadcn
- LlamaIndexTS

---

### Server Function

```ts {*|3,13,25,31,37|2,12,23,30,36}{maxHeight:'50vh'}
export const getNotes = cache(async (): Promise<Note[]> => {
  "use server";
  const data = await sql`SELECT * FROM notes`;
  return data.map((note: any) => ({
    id: note.id,
    title: note.title,
    content: note.content,
  }));
});

export const getNote = cache(async (id: string): Promise<Note> => {
  "use server";
  const data = await sql`SELECT * FROM notes WHERE id = ${id}`;
  const note = data[0];
  return {
    id: note.id,
    title: note.title,
    content: note.content,
  };
});

export const addNote = async (note: Pick<Note, "title" | "content">) => {
  "use server";
  const data =
    await sql`INSERT INTO notes (title, content) VALUES (${note.title}, ${note.content})`;
  rerender(`/`);
};

export const updateNoteTitle = async (id: string, title: string) => {
  "use server";
  const data = await sql`UPDATE notes SET title = ${title} WHERE id = ${id}`;
  rerender(`/notes/${id}`);
};

export const updateNoteContent = async (id: string, content: string) => {
  "use server";
  const data =
    await sql`UPDATE notes SET content = ${content} WHERE id = ${id}`;
  rerender(`/notes/${id}`);
};
```

---

### Component

```tsx
export default async function Note({ noteId }: { noteId: string }) {
  const noteResource = getNote(noteId);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NoteTitle noteResource={noteResource} />
      <div className="overflow-scroll size-full block rounded-lg border border-dashed shadow-sm">
        {noteResource.then(({ content, id }) => (
          <Editor content={content} id={id} />
        ))}
      </div>
    </main>
  );
}
```

## Question-Answering

---

## Multi-Modal

---

## Agent

---

## Workflow

---

## LlamaParse

From unstructured data like (PDF, DOCX, etc.) to structured data(JSON, raw text, etc.)

---

## LlamaCloud (private beta)

All in one solution for RAG

- No worry about hosting
- No worry about data storage
- No worry about benchmarking

---

## What's more about LlamaIndexTS?

- Data loader
- More vector store / doc store / index store
- More LLM / Embedding
- Our community & your contribution

---

Thank you!
