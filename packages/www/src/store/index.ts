"use server";
/**
 * CREATE TABLE Notes (
 *     id serial not null primary key,
 *     title VARCHAR(255) NOT NULL,
 *     content TEXT NOT NULL,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */
import { cache } from "react";
import { sql, updateNoteEmbedding } from "../lib/sql";
import { unstable_rerenderRoute } from "waku/router/server";

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
  const note = data[0]!;
  return {
    id: note.id,
    title: note.title,
    content: note.content,
  };
});

export const addNote = async (note: Pick<Note, "title" | "content">) => {
  "use server";
  await sql`INSERT INTO notes (title, content) VALUES (${note.title}, ${note.content})`;
  unstable_rerenderRoute(`/`);
};

export const updateNoteTitle = async (id: string, title: string) => {
  "use server";
  await sql`UPDATE notes SET title = ${title} WHERE id = ${id}`;
  unstable_rerenderRoute(`/note/${id}`);
};

export const updateNoteContent = async (id: string, content: string) => {
  "use server";
  await sql`UPDATE notes SET content = ${content} WHERE id = ${id}`;
  updateNoteEmbedding(id, content).catch(console.error);
};
