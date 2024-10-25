"use client";
import { useEffect, useRef, useState } from "react";

import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "./message";

import { ChatScrollAnchor } from "../lib/hooks/chat-scroll-anchor";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "../lib/hooks/use-enter-submit";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { IconArrowElbow, IconPlus } from "./ui/icons";
import { Button } from "./ui/button";
import { ChatList } from "./chat-list";
import { AI } from "../ai/provider";
import { useAtomValue } from "jotai/react";
import { editorAtom } from "../store/client";

export type ChatProps = {
  noteId: string | null;
};

export const Chat = (props: ChatProps) => {
  const editor = useAtomValue(editorAtom);
  const [{ messages }, setUIState] = useUIState<typeof AI>();
  const { submitSimple, submitIndex } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow mt-8">
        <ChatList messages={messages} />
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="w-full">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={async (e: any) => {
                e.preventDefault();

                const noteId = props.noteId;
                if (!noteId) return;

                const value = inputValue.trim();
                setInputValue("");
                if (!value) return;

                // Add user message UI
                setUIState((state) => ({
                  ...state,
                  messages: [
                    ...state.messages,
                    {
                      id: Date.now(),
                      display: <UserMessage>{value}</UserMessage>,
                    },
                  ],
                }));

                try {
                  // Submit and get response message
                  const responseMessage = await submitIndex(value, noteId);
                  setUIState((state) => ({
                    ...state,
                    messages: [...state.messages, responseMessage],
                  }));
                } catch (error) {
                  // You may want to show a toast or trigger an error state.
                  console.error(error);
                }
              }}
            >
              <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={inputValue === ""}
                      >
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
