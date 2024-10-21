"use client";

import { Button } from "./ui/button";
import { useSetAtom } from "jotai";
import { openAskAIAtom } from "../store/client";

export const AskAiButton = () => {
  const setOpen = useSetAtom(openAskAIAtom);
  return (
    <Button className="w-full" variant="default">
      Ask AI
    </Button>
  );
};
