"use client";
import { notesAtom } from "../store/client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useSetAtom } from "jotai/react";
import { useRouter_UNSTABLE as useRouter } from "waku/router/client";

export const NewNoteButton = () => {
  const setNotes = useSetAtom(notesAtom);
  const { push } = useRouter();
  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        const noteId = crypto.randomUUID();
        setNotes((prev) => [
          ...prev,
          {
            id: noteId,
            content: "",
            title: "Untitled Note",
          },
        ]);
        push(`/note/${noteId}`);
      }}
    >
      <Plus className="mr-2 h-4 w-4" /> New Note
    </Button>
  );
};
