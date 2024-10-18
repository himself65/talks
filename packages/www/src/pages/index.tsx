import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { NewNoteButton } from "../components/new-note-button";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="ml-2 text-lg font-semibold md:text-2xl">Notes</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You don't have any notes yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Click the button below to create a new note
          </p>
          <NewNoteButton />
        </div>
      </div>
    </main>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
