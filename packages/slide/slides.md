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

# Build RAG web app using LlamaIndexTS

---

layout: intro
class: pl-30
glowSeed: 14

---

# Alex Yang

<div class="[&>*]:important-leading-10 opacity-80">
Member of Node.js, Jotai, Waku<br>
Working at LlamaIndex<br>
</div>

<div my-10 w-min flex="~ gap-1" items-center justify-center>
  <div i-ri-github-line op50 ma text-xl ml4/>
  <div><a href="https://github.com/antfu" target="_blank" class="border-none! font-300">himself65</a></div>
  <div i-ri-twitter-x-line op50 ma text-xl ml4/>
  <div><a href="https://twitter.com/antfu7" target="_blank" class="border-none! font-300">himseif65</a></div>
</div>

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

## Multi-Modal

Natively!

```ts
const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
const storageContext = await getStorageContext();
const index = await VectorStoreIndex.fromDocuments(documents, {
  storageContext,
});

const retriever = index.asRetriever({ topK: { TEXT: 1, IMAGE: 3 } });
const results = await retriever.retrieve({
  query: "what are Vincent van Gogh's famous paintings",
});
for (const result of results) {
  const node = result.node;
  if (!node) {
    continue;
  }
  if (node instanceof ImageNode) {
    console.log(`Image: ${node.getUrl()}`);
  } else if (node instanceof TextNode) {
    console.log("Text:", node.text);
  }
}
```

---

## Agent

Tool call

```ts
export const getCurrentIDTool = FunctionTool.from(
  () => {
    // ...
  },
  {
    name: "get_user_id",
    description: "Get a random user id",
  },
);
```

```ts
import {
  getCurrentIDTool,
  getUserInfoTool,
  getWeatherTool,
} from "./utils/tools";
const agent = new OpenAIAgent({
  tools: [getCurrentIDTool, getUserInfoTool, getWeatherTool],
});

const response = await agent.chat(
  "What is my current address weather based on my profile address?",
);
```

```ts
const task = await agent.createTask(
  "What is my current address weather based on my profile?",
  true,
);
for await (const stepOutput of task) {
  const stream = stepOutput.output as ReadableStream<ChatResponseChunk>;
  if (stepOutput.isLast) {
    for await (const chunk of stream) {
      process.stdout.write(chunk.delta);
    }
    process.stdout.write("\n");
  } else {
    // handing function call
    console.log("handling function call...");
    for await (const chunk of stream) {
      console.log("debug:", JSON.stringify(chunk.raw));
    }
  }
}
```

---

## Workflow

```ts
const codeAgent = new Workflow({ validate: true });
codeAgent.addStep(StartEvent, architect, { outputs: CodeEvent });
codeAgent.addStep(ReviewEvent, coder, { outputs: CodeEvent });
codeAgent.addStep(CodeEvent, reviewer, { outputs: ReviewEvent });

const run = codeAgent.run(specification);
for await (const event of codeAgent.streamEvents()) {
  const msg = (event as MessageEvent).data.msg;
  console.log(`${msg}\n`);
}
const result = await run;
console.log("Final code:\n", result.data.result);
```

---

## LlamaParse

From unstructured data like (PDF, DOCX, etc.) to structured data(JSON, raw text, etc.)

```shell
npm i @llamaindex/cloud
```

Also support in browser

---

## LlamaCloud (private beta)

cloud.llamaindex.ai

All in one solution for RAG

- hosting
- data storage
- performance

```ts
const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
const vectorIndex = await VectorStoreIndex.fromDocuments(documents);
const retriever = vectorIndex.asRetriever({ similarityTopK: 3 });
```

```ts
import { LlamaCloudIndex } from "llamaindex";

const reader = new SimpleDirectoryReader();
const documents = await reader.loadData({
  directoryPath: "./data",
});
const vectorIndex = await LlamaCloudIndex.fromDocuments(documents);
const retriever = vectorIndex.asRetriever({ similarityTopK: 3 });
```

---

# LlamaIndexTS

## What we covered

- RAG
  - Data Reader
  - Index
  - Retriever
- Multimodal
- Agent
- Workflow

## Roadmap

- Revamped Workflow v2
  - better type
  - generate flow graph in UI
- Better Multimodal
  - gpt voice
- Better Document (fumadoc)
- Better Structure ouput (zod)

---

layout: center
class: 'text-center pb-5'

---

# Thank You!

- Slides and Demo, himself65/cityjs-2024
- All Code Example, runllama/LlamaIndex.TS
