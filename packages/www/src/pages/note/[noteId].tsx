import Editor from "../../components/editor";
import { getNote } from "../../store";
import { NoteTitle } from "../../components/note-title";

export default async function Note({ noteId }: { noteId: string }) {
  const noteResource = getNote(noteId);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NoteTitle noteResource={noteResource} />
      <div className="overflow-scroll h-0 flex flex-grow items-center justify-center rounded-lg border border-dashed shadow-sm">
        {noteResource.then(({ content }) => (
          <Editor content={content} />
        ))}
      </div>
    </main>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
