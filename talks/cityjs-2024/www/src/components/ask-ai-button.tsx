"use client";

import { Button } from "./ui/button";
import { useOpenAsk } from "../store/client";

export const AskAiButton = () => {
  const setOpen = useOpenAsk()[1];
  return (
    <Button className="w-full" variant="default">
      Ask AI
    </Button>
  );
};
