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

Member of Node.js, Jotai.

Working at LlamaIndex.

---

## What is RAG?

---

## Start with simple note-taking example

```ts
export type Note = {
  id: string;
  title: string;
  content: string;
};

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

## Question-Answering

---

## Multi-Modal

---

## Agent

---

## Workflow

---

## What LlamaIndexTS brings more?

- Data loader
- More vector store / doc store / index store
- More LLM / Embedding
- Our community & your contribution

---

Thank you!
