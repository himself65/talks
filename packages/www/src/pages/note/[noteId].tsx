import Editor from "../../components/editor";
import { getNote } from "../../store";
import { NoteTitle } from "../../components/note-title";
import { Suspense } from "react";

export default async function Note({ noteId }: { noteId: string }) {
  const noteResource = getNote(noteId);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NoteTitle noteResource={noteResource} />
      <div className="overflow-scroll size-full block rounded-lg border border-dashed shadow-sm">
        <Suspense>
          {noteResource.then(({ content, id }) => (
            <Editor content={content} id={id} />
          ))}
        </Suspense>
      </div>
    </main>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
