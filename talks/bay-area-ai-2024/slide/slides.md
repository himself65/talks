---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
glowSeed: 4
title: Introduction to LlamaIndex Workflows
remoteAssets: true
---

<img class="size-20" src="/logo.svg" /> 

# Introduction to LlamaIndex Workflows

<div class="absolute bottom-10 right-10 text-right">
by Alex Yang
</div>

<!--
Hello, everyone. I'm Alex, today. I'm gonna talk about the LlamaIndex Workflow.
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
First, let me introduce myself first. I'm Alex Yang, Im mostly working on frontend, also the member of the node.js, and some react ecosystem like jotai a state managerment library and waku, a minimal react framework.

Currently I'm working in LlamaIndex and working on building RAG cloud platform and LlamaIndex open source projects.
-->

---
layout: two-cols
---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow

Chat + Tool call

::right::

## Diagram

<img src="/01_basic_agent.png" class="h-3/4" />

<!--
We can start a simple agent example, the human ask a question and we call llm
-->

---

## Without Workflow

````md magic-move
```python
async def run(
    user_msg: str,
):
    # init
    chat_history = []
    chat_history.append(ChatMessage(role="user", content=user_msg))
    system_prompt = "..."
```

```python
async def run(
    user_msg: str,
):
    # init
    # ...

    # chat with llm
    llm_input = [ChatMessage(role="system", content=system_prompt)] + chat_history
    response = await llm.achat_with_tools(tools, chat_history=llm_input)
    
    # handle response
    tool_calls: list[ToolSelection] = llm.get_tool_calls_from_response(
        response, error_on_no_tool_call=False
    )

    chat_history.append(response.message)

    if len(tool_calls) == 0:
        return response.message.content
    else:
        # start over the llm chat with the tool
```

```python
async def run(
    user_msg: str,
):
    # init
    # ...
    while True:        
        llm_input = [ChatMessage(role="system", content=system_prompt)] + chat_history

        # chat with llm
        response = await llm.achat_with_tools(tools, chat_history=llm_input)
        
        # handle response
        tool_calls: list[ToolSelection] = llm.get_tool_calls_from_response(
            response, error_on_no_tool_call=False
        )

        chat_history.append(response.message)

        if len(tool_calls) == 0:
            return response.message.content
        else:
            for tool_call in tool_calls:
                # start over the llm chat with the tool
                tool_response = tools[tool_call.tool_id].run(tool_call.args)
                chat_history.append(ChatMessage(role="tool", content=tool_response))
```
````

---
layout: two-cols
---

## Without Workflow

<div class="mt-2 flex flex-col gap-4">
<v-click>
<div class="flex flex-row gap-2 items-center">
  <div i-ph-warning-duotone text-orange text-xl /> manage the state
</div>
</v-click>

<v-click>
<div class="flex flex-row gap-2 items-center">
  <div i-ph-warning-duotone text-orange text-xl /> parallelize the tool calls
</div>
</v-click>

<v-click>
<div class="flex flex-row gap-2 items-center">
  <div i-ph-warning-duotone text-orange text-xl /> error handling
</div>
</v-click>

<v-click>
<div class="flex flex-row gap-2 items-center">
  <div i-ph-warning-duotone text-orange text-xl /> debugging
</div>
</v-click>

<v-click>
<div class="flex flex-row gap-2 items-center">
  <div i-ph-warning-duotone text-orange text-xl /> scalability
</div>
</v-click>
</div>

::right::

```python
async def run(
        user_msg: str,
):
    # init
    # ...
    while True:
        llm_input = [ChatMessage(role="system", content=system_prompt)] + chat_history

        # chat with llm
        response = await llm.achat_with_tools(tools, chat_history=llm_input)

        # handle response
        tool_calls: list[ToolSelection] = llm.get_tool_calls_from_response(
            response, error_on_no_tool_call=False
        )

        chat_history.append(response.message)

        if len(tool_calls) == 0:
            return response.message.content
        else:
            for tool_call in tool_calls:
                # start over the llm chat with the tool
                tool_response = tools[tool_call.tool_id].run(tool_call.args)
                chat_history.append(ChatMessage(role="tool", content=tool_response))
```

---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow

````md magic-move
```python
class LLMCallEvent(Event):
    pass

class ToolCallEvent(Event):
    pass

class ToolCallResultEvent(Event):
    chat_message: ChatMessage

class ProgressEvent(Event):
    msg: str
```

```python
class BasicAgent(Workflow):
    @step
    async def setup(
        self, ctx: Context, ev: StartEvent
    ) -> LLMCallEvent:
        user_msg = ev.get("user_msg")
        chat_history = []
        chat_history.append(ChatMessage(role="user", content=user_msg))
        await ctx.set("chat_history", chat_history)
        return LLMCallEvent()
```

```python
class BasicAgent(Workflow):
    ...

    @step
    async def speak_with_agent(
        self, ctx: Context, ev: LLMCallEvent
    ) -> ToolCallEvent | StopEvent:
        response = await llm.achat_with_tools(tools, chat_history=llm_input)
        tool_calls: list[ToolSelection] = llm.get_tool_calls_from_response(
            response, error_on_no_tool_call=False
        )

        if len(tool_calls) == 0:
            return StopEvent(
                result={
                    "response": response.message.content,
                }
            )

        await ctx.set("num_tool_calls", len(tool_calls))

        for tool_call in tool_calls:
            ctx.send_event(
                ToolCallEvent(tool_call=tool_call, tools=agent_config.tools)
            )
```

```python
class BasicAgent(Workflow):
    ...

    @step(num_workers=4)
    async def handle_tool_call(
        self, ctx: Context, ev: ToolCallEvent
    ) -> ToolCallResultEvent:
        tool_call = ev.get("tool_call")
        tool_response = ev.get("tools")[tool_call.tool_id].run(tool_call.args)
        return ToolCallResultEvent(chat_message=tool_msg)
        
    @step
    async def aggregate_tool_results(
        self, ctx: Context, ev: ToolCallResultEvent
    ) -> LLMCallEvent:
        """Collects the results of all tool calls and updates the chat history."""
        num_tool_calls = await ctx.get("num_tool_calls")
        results = ctx.collect_events(ev, [ToolCallResultEvent] * num_tool_calls)
        if not results:
            return
        chat_history = await ctx.get("chat_history")
        chat_history.extend([result.chat_message for result in results])
        await ctx.set("chat_history", chat_history)
        return LLMCallEvent()
```
````

---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow

````markdown magic-move
```python
from llama_index.core.graph_stores import SimpleGraphStore
from llama_index.core import StorageContext, KnowledgeGraphIndex

graph_store = SimpleGraphStore()
storage_context = StorageContext.from_defaults(graph_store=graph_store)

index = KnowledgeGraphIndex.from_documents(
    documents,
    max_triplets_per_chunk=2,
    storage_context=storage_context,
)
chat_engine = index.as_chat_engine()
chat_engine.chat(
    message="...",
    chat_history=[],
)
```

```python
from llama_index.core import StorageContext, KnowledgeGraphIndex
from llama_index.core.tools import QueryEngineTool

graph_store = SimpleGraphStore()
storage_context = StorageContext.from_defaults(graph_store=graph_store)

# NOTE: can take a while!
index = KnowledgeGraphIndex.from_documents(
    documents,
    max_triplets_per_chunk=2,
    storage_context=storage_context,
)
query_engine = index.as_query_engine()
tool = QueryEngineTool.from_defaults(
  query_engine=query_engine,
  name="query from knowledge graph",
  description="...",
)
```

```python
from llama_index.vector_stores.neo4jvector import Neo4jVectorStore

neo4j_vector = Neo4jVectorStore(username, password, url, embed_dim)

index = neo4j_vector.index_documents(
    documents,
    max_triplets_per_chunk=2,
)
```
````

---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow

```python
from llama_index.utils.workflow import (
    draw_all_possible_flows,
)

# Draw all
draw_all_possible_flows(workflow, filename="workflow-preview.html")
```

<!--
We also provider the debugger tool that you can
-->

---

![diagram-preview.png](/diagram-preview.png)

---

# <img class="inline-block" src="/logo.svg" /> LlamaIndex Deploy

<v-click>
  <div class="flex flex-row gap-2 items-center">
     <div i-ph-check-circle-duotone text-green text-xl /> Seamless Deployment
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
     <div i-ph-check-circle-duotone text-green text-xl /> Scalability
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
     <div i-ph-check-circle-duotone text-green text-xl /> State Management
  </div>
</v-click>
<v-click>
  <div class="flex flex-row gap-2 items-center">
     <div i-ph-check-circle-duotone text-green text-xl /> Async-first
  </div>
</v-click>

<v-click>
```yaml
name: QuickStart

control-plane:
port: 8000

default-service: basic_agent

services:
basic_agent:
name: Basic Agent
source:
type: local
name: .
path: workflow_demo.py:basic_agent

```
</v-click>

---
layout: two-cols
---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Deploy

```shell
$ python -m llama_deploy.apiserver
INFO:     Started server process [10842]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:4501 (Press CTRL+C to quit)

$ llamactl deploy deployment.yml
Deployment successful: QuickStart

$ llamactl run --deployment QuickStart --arg message 'Hello, LlamaIndex!'
```

::right::

<div class="mt-10"/>

![structure.png](/structure.png)

---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow JS

```shell
npm add @llamaindex/workflow
```

---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow JS

### Streaming with UI

```tsx
'use server';
import { createStreamableUI } from 'ai/rsc';
import { runWithoutBlocking } from './utils';

export async function compute () {
  'use server';
  const ui = createStreamableUI();
  const context = workflow.run(100, {
    sum: 0
  });
  runWithoutBlocking(async () => {
    for await (const event of context) {
      if (event instanceof ComputeResultEvent) {
        // Update UI
      } else if (event instanceof StopEvent) {
        // Update UI
      }
      // ...
    }
  });
  return ui.value;
}
```

---
layout: two-cols
---

## <img class="inline-block" src="/logo.svg" /> LlamaIndex Workflow

### Context serialization

- Allow to stop and resume the workflow (e.g. for debugging, HTTP server, job queue)

::right::

<div class="mt-10"/>

<div class="ml-4">

````md magic-move

```typescript
workflow.addStep({
  inputs: [StartEvent<string>],
  outputs: [...]
}, async (context, startEvent) => {
  const input = startEvent.data;
  if (someCondition) {
    // need user input more infomation
    return new RequireUserInputEvent();
  }
  // ...
});
```

```typescript
// pause the workflow
const workflow = new Workflow()
const context = workflow.run(input).with(data)
for await (const event of context) {
  if (event instanceof RequireUserInputEvent) {
    // pause the workflow
    const snapshot: Uint8Array = context.snapshot()
    const signature = crypto.sign(snapshot)
    await db.set(signature, context.data)
    return res.json({ 
      type: 'require-user-input',
      snapshot,
      signature
    })
  }
}
```

```typescript
// resume the workflow
const snapshot = req.body.snapshot
const signature = req.body.signature
if (snapshot && signature) {
  if (crypto.verify(snapshot, signature)) {
    const restoredData = db.get(cacheKey)
    const context = workflow.recover(snapshot).with(restoredData)
    for await (const event of context) {
      // ... 
    }
  }
}
```

```python
# pause / resume the workflow in Python
wf = Workflow()
handler = wf.run()
// ...
# if we allow pickle, then we can pickle the LLM/embedding object
state_dict = handler.ctx.to_dict(serializer=JsonPickleSerializer())

new_handler = WorkflowHandler(
    ctx=Context.from_dict(wf, state_dict, serializer=JsonPickleSerializer())
)
```
````

</div>

---
glowHue: 90
glow: top-right
class: flex items-center justify-center
---

## <img class="inline-block" src="/logo.svg" /> Create Llama

<Tweet id="1856589050129592809" class="ml-2 h-full overflow-scroll important:[&_iframe]:w-200 important:[&_iframe]:rounded-13px important:[&_iframe]:shadow-xl" v-click />

---

## Summary

- LlamaIndex Workflow
- LlamaIndex Workflow JS
- Llama Deploy
- create-llama
  - for both python and javascript template
- Some low-level APIs
  - Context serialization

---
layout: center
class: 'text-center pb-5'
---

# Thank You!

<div flex-col flex="~ gap-1" items-center justify-center>
<div class="flex gap-1 items-center">
  LlamaIndex <div inline-block i-ri-github-line op50 ma text-xl/>
  <a href="https://github.com/run-llama/llama_index">runllama/llama_index</a>
</div>
<div class="flex gap-1 items-center">
  LlamaIndex.TS<div inline-block i-ri-github-line op50 ma text-xl/>
  <a href="https://github.com/run-llama/LlamaIndexTS">runllama/LlamaIndex.TS</a>
</div>
</div>
