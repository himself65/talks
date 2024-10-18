import { NoteTitle } from "../../components/note-title";
import Editor from "../../components/editor";

export default function Note({ noteId }: { noteId: string }) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NoteTitle noteId={noteId} />
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <Editor />
      </div>
    </main>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
