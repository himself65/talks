"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export type EditorProps = {
  content: string;
};

export default function Editor(props: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg m-5 focus:outline-none",
      },
    },
    immediatelyRender: false,
    content: props.content || "Click here to start typing...",
  });

  return (
    <div className="size-full block">
      <EditorContent editor={editor} />
    </div>
  );
}
