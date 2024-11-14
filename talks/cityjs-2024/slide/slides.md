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

<!--
Hi, everyone, glad to be here talking about AI, RAG and LlamaIndex.
-->

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
  <div><a href="https://github.com/himself65" target="_blank" class="border-none! font-300">himself65</a></div>
  <div i-ri-twitter-x-line op50 ma text-xl ml4/>
  <div><a href="https://twitter.com/himself65" target="_blank" class="border-none! font-300">himseif65</a></div>
</div>

<img src="https://avatars.githubusercontent.com/u/14026360" class="w-32 h-32 rounded-full absolute top-40 right-15" />

<!--
[introduce self first]

For today topic, we gonna cover the basic RAG using LlamaIndex, and some key feature that LlamaIndex can do.
-->

---

## What is RAG?

### Without RAG

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="/00.excalidraw.json"
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

<!--
So, What's the RAG?
You might try some simple chat demo yeasterday on LLM 101.

How to interactive with LLM?

Basically, you just structure your question inside a wall designed prompt, Prompt Engineer, plus your data. For example, your daily notes on notion, your draft in your notebook.

But if you have large amount of data, this cause a problem.

Costly, every token passed to AI is charged. Even Google Gemini has super large context window, you can put everything inside, BUT It's not free.

Inaccurate, I ask the question about the Math, but I give all chemistry class note. AI might responses inaccurate, meaningless, unrelated result.

Slow, from Engineer perspective, you device will load all document into memory then give OpenAI, there will have network bandwidth.

So, that's why we have RAG.
-->

---

## What is RAG?

### With RAG

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="/01.excalidraw.json"
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

<!--
So that's why we have RAG.

Basically it's trying to solve the problem that cost least computation.
In this diagram, there's a module called retriever, which responsible for fetching the most relevant context given a user query. Then feed into the prompt, gives to LLM.

How do we do this using llamaindex.ts?
-->

---

## <img class="inline-block" src="/logo.svg" /> Load, Store, Query

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

<!--
First, we have conecpt of Loader, which will load your data into llm readable format, for now, it's text document.

You can see I call a new SimpleDirectoryReader, which is a utility class that includes many ohter data loader like PDFLoader, HTMLLoader, RawTextLoader... balabalba.

Then we have documents array, which includes text.

[click]

Then, we create a VectorStoreIndex. It will compile the documents into comparable format. We call it embeddings. It's a number of array and eacy number indicate a property of something.

Then we treat it as a retriever, and here I only need top 3 relevant data.

Then llamaindex.ts have different typeof queryEngine, here we use RetrieverQueryEngine, and then you can export it just like a normal chat function.
-->

---

## <img class="inline-block" src="/logo.svg" /> Simple Chat Engine

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

<!--
For a simple chat function.

we have memory buffer for storing chat history.

[click]

and we have simple chat engine, without any optimization, just leave data as-is.

[click]

here, we use a node.js readline to have REPL in your terminal.
-->

---

## <img class="inline-block" src="/logo.svg" /> Vector Store

Text -> Vector

<div class="flex flex-col items-center">

<Excalidraw
drawFilePath="/02.excalidraw.json"
class="w-[600px]"
:darkMode="true"
/>

</div>

<!--
You remember we talked about vector? 
Officially, A vector is a numerical representation of the meaning of text in a node.

We have vector store you can store the vector into like local file, or a database
-->

---

## <img class="inline-block" src="/logo.svg" /> Vector Store

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

<!--
For example, here I used our postgres vector store.

It's very to use to add document into a real database.
-->

---
layout: center
class: text-center
glowX: 50
glowY: 50
glowSize: 0.4
---

# <img class="inline-block" src="/logo.svg" /> Demo

<https://cityjs2024.demo.llamaindex.ai>

---

## <img class="inline-block" src="/logo.svg" /> Features

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
Vercel AI SDK (utility for AI)
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

<!--
what's really inside of the code, is just what I introduced before.

I have chatEngine, for here it could be retriever chat engine or just simple chat engine if you don't worry about the over context size.
-->

---
layout: center
---

## <img class="inline-block" src="/logo.svg" /> Multi Modal

<v-click>
Builtin support
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

<!--
What about the multimodal? like image?

Builtin support

we have text document, also have image document, so it's very easy to use multi modal using llamaindex.ts
-->

---

## <img class="inline-block" src="/logo.svg" /> Agent

Tool call

````md magic-move
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
````

---

## <img class="inline-block" src="/logo.svg" /> Workflow

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

<!--
LlamaIndex Workflow, it's an event-driven abstraction used to chain together several events.

So you imaging agent is just a chain call, user input -> tool call -> tool call, multiple tool cal, ai response.

But the wokrflow could be a diagram, could includes multiple level of LLM doing their different jobs based on different prompt and context.
-->

---
layout: center
---

<v-click>
<h2 class="mb-4">
  <img class="inline-block" src="/logo.svg" /> Create llama
</h2>
</v-click>

<v-click>
```shell
npx create-llama@latest
```

<img class="h-[256px] w-full mt-4" src="/create-llama.gif" />
</v-click>

<!--
wait, alex, introducted so many API in 20 mins. I cannot catch up. Is there anyway to easy start?

Right

[click]

we have create llama. It's just like create-next-app or create-react-app, but it's for AI.

[click]

with create llama, you can easily start build your own AI tools with our templates.

we have both python, and javascript starter. under Next.js, so it includes both server and client feature to start with.
-->

---
glowHue: 90
glow: top-right
class: flex items-center justify-center
---

<Tweet id="1849021022093377738" class="h-full overflow-scroll important:[&_iframe]:w-200 important:[&_iframe]:rounded-13px important:[&_iframe]:shadow-xl" v-click />

<!--
He is my colleague, working on create llama. Days ago we published the workflow API using create-llama.

You can have a try now.
-->

---

## <img class="inline-block" src="/logo.svg" /> LlamaParse

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

<!--
Beside of that, we have llama parse.

Comparing with npm pdfjs, it's more accurate, and support many features.

[read the list]

You can try it today at ...
-->

---

## <img class="inline-block" src="/logo.svg" /> LlamaCloud (private beta)

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

<!--
Like I said, if you worry about like hosting, data sotrage, and performance.

Yeah we didn't talk many topics like performance, for example how to embedding High-efficiency, how to split your large document into small parts to make retriever get the most accurate result.

But we have llamacloud, for all in one solution you can signup for whitelist.

 [click]

yeah, you can just by replacing the module.
-->

---
layout: two-cols-header
---

# <img class="inline-block" src="/logo.svg" /> LlamaIndex.TS

::left::

<v-click>

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

</v-click>

::right::

<v-click>

## Roadmap

- Revamped Workflow v2
  - better type
  - generate flow graph in UI
- Better Multimodal
  - voice input / output
- [Better Document](https://ts.llamaindex.ai/) (fumadoc)
  - Call for volunteers
- Structured Outputs (zod)

</v-click>

<!--
So, let's look back about what we discussed so far.

we introduced the RAG. you combine data reader, index retriever, then you have a basic RAG.

we talked about the multimodal that llamaindex.ts builtin support.

we talked about agent and workflow you can customize your logic, with LLM.

and we have llamacloud, llamaparse to reduce the time you spend

of course we have create llama you can just npx create-llama to start a RAG in few lines.

[click]

for the next milestone.

we gonna have better typescript on workflow, type hinting. so that you can generate the graph in UI.

then we need better multimodal, for gpt voice input and output.

and structued output, which we a little bit delay because I was refactoring some core modules to make sure they are working better with new features.

and the better document, for this one, we wanna implement some function with UI totural to help you to understand what's RAG and how to get started.

yesterday I just created the basic homepage for our new document. the rest parts are still pure markdown files, but you still could learn the depth of the RAG.
-->

---
layout: center
class: 'text-center pb-5'
---

# Thank You!

<div flex-col flex="~ gap-1" items-center justify-center>
<div class="flex gap-1 items-center">
  Slides and Demo <div inline-block i-ri-github-line op50 ma text-xl/>
  <a href="https://github.com/himself65/talks">himself65/talks</a>
</div>
<div class="flex gap-1 items-center">
  All Code Example <div inline-block i-ri-github-line op50 ma text-xl/>
  <a href="https://github.com/run-llama/LlamaIndexTS">runllama/LlamaIndex.TS</a>
</div>
</div>

<div class="absolute bottom-10 left-10 flex flex-col items-start text-sm">
<div>
  ❤️ <a href="https://github.com/dai-shi">Daishi Kato</a> for Waku
</div>
<div>
  ❤️ <a href="https://github.com/marcusschiesser">Marcus Schiesser</a> for Create Llama
</div>
</div>

<!--
And, that's it.

you can find all my slides, demo in my github profile. and more code example in runllama/LlamaIndex.TS

[thanks]
-->
