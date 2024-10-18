"use client";
import { useAtomValue, useAtom } from "jotai";
import { notesAtom } from "../store/client";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter_UNSTABLE as useRouter } from "waku/router/client";

export const NoteListPreview = () => {
  const notes = useAtomValue(notesAtom);
  const { push, path } = useRouter();
  const selectedNoteId = path.split("/").pop();
  return (
    <ScrollArea className="h-96">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-4 border-b border-border cursor-pointer hover:bg-accent ${
            note.id === selectedNoteId ? "bg-accent" : ""
          }`}
          onClick={() => push(`/note/${note.id}`)}
        >
          <h3 className="font-semibold truncate">{note.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {note.content}
          </p>
        </div>
      ))}
    </ScrollArea>
  );
};
