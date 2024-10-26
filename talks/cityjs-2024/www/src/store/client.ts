import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { Editor } from "@tiptap/react";
import { createContextState } from "foxact/create-context-state";

export const openAskAIAtom = atomWithStorage("open-ask-ai", false);

const [EditorProvider, useEditor, useSetEditor] = createContextState<Editor | null>(null);
export { EditorProvider, useEditor, useSetEditor };
