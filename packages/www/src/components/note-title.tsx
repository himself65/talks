"use client";
import { Input } from "./ui/input";
import { useState, use, startTransition } from "react";
import { Note, updateNoteTitle } from "../store";

type NoteTitleProps = {
  noteResource: Promise<Note>;
};

export const NoteTitle = (props: NoteTitleProps) => {
  const note = use(props.noteResource);
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
            // fixme: optimistic update
            startTransition(async () => {
              await updateNoteTitle(note.id, title);
            });
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
