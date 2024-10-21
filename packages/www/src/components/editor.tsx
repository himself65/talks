"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";
import { updateNoteContent } from "../store";

export type EditorProps = {
  id: string;
  content: string;
};

export default function Editor(props: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg m-5 focus:outline-none",
      },
    },
    immediatelyRender: false,
    content: props.content,
  });

  const prevState = useRef<string>();

  // use a simple interval to save the content
  //  you can replace this with a more sophisticated solution:
  //  - yjs backend
  useEffect(() => {
    if (editor) {
      const id = setInterval(() => {
        const currentState = editor.getHTML();
        if (prevState.current === currentState) {
          return;
        }
        prevState.current = currentState;
        updateNoteContent(props.id, currentState).catch(console.error);
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [editor, props.id]);

  return (
    <EditorContent
      onBlur={useCallback(() => {
        if (editor) {
          updateNoteContent(props.id, editor.getHTML()).catch(console.error);
        }
      }, [editor, props.id])}
      autoFocus
      editor={editor}
    />
  );
}
