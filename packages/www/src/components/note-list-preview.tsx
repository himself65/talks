import { getNotes } from "../store";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "waku/router/client";

export type NoteListPreviewProps = {
  currentNoteId: string | undefined | null;
};

export const NoteListPreview = async ({
  currentNoteId,
}: NoteListPreviewProps) => {
  const notes = await getNotes();
  return (
    <ScrollArea className="h-96">
      {notes.map((note) => (
        <Link to={`/note/${note.id}`} key={note.id}>
          <div
            className={`p-4 border-b border-border cursor-pointer hover:bg-accent ${
              note.id === currentNoteId ? "bg-accent" : ""
            }`}
          >
            <h3 className="font-semibold truncate">{note.title}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {note.content}
            </p>
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
};
