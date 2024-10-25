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
layout: center
class: text-center
glowX: 50
glowY: 50
glowSize: 0.4
---

# Demo

<https://demo-cityjs.llamaindex.ai>

---

## Features

<v-click>
<li>
React Server Component / React Server Function (not Next.js)
</li>
</v-click>

<v-click>
<li>
Waku (created by Daishi Kato)
</li>
</v-click>

<v-click>
<li>
TipTap Editor
</li>
</v-click>

<v-click>
<li>
Vecerl AI SDK (utility for AI)
</li>
</v-click>

<v-click>
<li>
Shadcn
</li>
</v-click>

<v-click>
<li>
LlamaIndexTS
</li>
</v-click>

---
layout: center
---

### AI SDK RSC

```tsx {*}{maxHeight:'50vh'}
import { createAI } from "ai/rsc";

export const AIProvider = createAI({
  actions: {
    search: async (query: string) => {
      "use server";
      const response = await chatEngine.chat({
        query,
        stream: true,
      });

      for await (const { delta } of response) {
        ui.append(delta);
      }

      return {
        id: Date.now(),
        display: <BotMessage>{ui.value}</BotMessage>,
      };
    },
  }
});
```

---
layout: center
---

## Multi Modal

<v-click>
Natively!
</v-click>

<v-click>
```ts
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
  }
}
```
</v-click>

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
layout: center
---

## Create llama

```shell
npx create-llama@latest
```

---
glowHue: 90
glow: top-right
class: flex items-center justify-center
---

<Tweet id="1849021022093377738" class="h-full overflow-scroll important:[&_iframe]:w-200 important:[&_iframe]:rounded-13px important:[&_iframe]:shadow-xl" v-click />

---

## LlamaParse

- State-of-the-art table extraction
- Provide natural language instructions to parse the output in the exact format you want it.
- JSON mode
- Image extraction
- Support for 10+ file types (.pdf, .pptx, .docx, .html, .xml, and more)
- Foreign language support

<https://cloud.llamaindex.ai>

```shell
npm i @llamaindex/cloud
```

---

## LlamaCloud (private beta)

<https://cloud.llamaindex.ai>

All in one solution for RAG

- hosting
- data storage
- performance

````md magic-move
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
````

---
layout: two-cols-header
---

# LlamaIndex.TS

::left::

## What we covered

- RAG
  - Data Reader
  - Index
  - Retriever
- Multimodal
- Agent
- Workflow
- LlamaCloud
  - LlamaParse
- Create llama

::right::

## Roadmap

- Revamped Workflow v2
  - better type
  - generate flow graph in UI
- Better Multimodal
  - voice input / output
- Better Document (fumadoc)
- Structured Outputs (zod)

---
layout: center
class: 'text-center pb-5'
---

# Thank You!

- Slides and Demo, himself65/cityjs-2024
- All Code Example, runllama/LlamaIndex.TS
