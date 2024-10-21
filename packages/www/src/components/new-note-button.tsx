"use client";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { addNote } from "../store";
import { startTransition } from "react";

export const NewNoteButton = () => {
  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        startTransition(async () => {
          await addNote({
            title: "Untitled Note",
            content: "",
          });
        });
      }}
    >
      <Plus className="mr-2 h-4 w-4" /> New Note
    </Button>
  );
};
