import { Editor } from "@tiptap/react";
import { createContextState } from "foxact/create-context-state";
import { createLocalStorageState } from "foxact/create-local-storage-state";

const [useOpenAsk, useOpenAskValue] = createLocalStorageState("open-ask-ai", false);

const [EditorProvider, useEditor, useSetEditor] = createContextState<Editor | null>(null);
export {
  useOpenAsk, useOpenAskValue,
  EditorProvider, useEditor, useSetEditor
};
