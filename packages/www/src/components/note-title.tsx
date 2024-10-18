"use client";
import { useAtomValue } from "jotai";
import { notesAtom } from "../store/client";
import { Input } from "./ui/input";
import { useSetAtom } from "jotai/react";
import { useState } from "react";

type NoteTitleProps = {
  noteId: string;
};

export const NoteTitle = (props: NoteTitleProps) => {
  const note = useAtomValue(notesAtom).find((note) => note.id === props.noteId);
  if (!note) {
    throw new Error(`Note with id ${props.noteId} not found`);
  }
  const setNotes = useSetAtom(notesAtom);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(note.title);
  return (
    <div className="flex items-center">
      {editMode ? (
        <Input
          className="ml-2 text-lg font-semibold md:text-2xl"
          value={title}
          onChange={(event) => {
            const title = event.target.value;
            setTitle(title);
          }}
          onBlur={() => {
            setEditMode(false);
            setNotes((notes) =>
              notes.map((n) => (n.id === props.noteId ? { ...n, title } : n)),
            );
          }}
          autoFocus
        />
      ) : (
        <h1
          className="ml-2 text-lg font-semibold md:text-2xl"
          onDoubleClick={() => setEditMode(true)}
        >
          {title}
        </h1>
      )}
    </div>
  );
};
