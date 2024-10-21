import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai/vanilla";
import { Editor } from "@tiptap/react";

export const openAskAIAtom = atomWithStorage("open-ask-ai", false);
export const editorAtom = atom(null as Editor | null);
