"use server";
import { VectorStoreIndex, MetadataMode, SimpleChatEngine } from "llamaindex";
import { PGVectorStore } from "llamaindex/vector-store/PGVectorStore";
import { createAI, createStreamableUI } from "ai/rsc";
import { sql } from "../lib/sql";
import { ReactNode } from "react";
import { runAsyncFnWithoutBlocking } from "../lib/utils";
import { Skeleton } from "../components/ui/skeleton";
import { ReadableStream } from "node:stream/web";
import { pipeline } from "node:stream/promises";
import { BotMessage } from "../components/message";

const vectorStore = new PGVectorStore({
  shouldConnect: false,
  client: sql,
});

// Split text and create embeddings. Store them in a VectorStoreIndex
const index = await VectorStoreIndex.fromVectorStore(vectorStore);
const initialAIState = {};

type UIMessage = {
  id: number;
  display: ReactNode;
};

const initialUIState = {
  messages: [],
} as {
  messages: UIMessage[];
};

export const AI = createAI({
  actions: {
    submitSimple: async (message: string): Promise<UIMessage> => {
      "use server";
      const simpleChatEngine = new SimpleChatEngine();
      const ui = createStreamableUI(
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>,
      );

      runAsyncFnWithoutBlocking(async () => {
        ui.update("");
        const response = await simpleChatEngine.chat({
          message,
          stream: true,
        });

        for await (const { delta } of response) {
          ui.append(delta);
        }

        ui.done();
      });

      return {
        id: Date.now(),
        display: <BotMessage>{ui.value}</BotMessage>,
      };
    },
    submitIndex: async (query: string) => {
      "use server";
      const queryEngine = index.asQueryEngine();
      const { response, sourceNodes } = await queryEngine.query({
        query,
      });

      // Output response with sources
      console.log(response);

      if (sourceNodes) {
        sourceNodes.forEach((source: any, index: number) => {
          console.log(
            `\n${index}: Score: ${source.score} - ${source.node
              .getContent(MetadataMode.NONE)
              .substring(0, 50)}...\n`,
          );
        });
      }
    },
  },
  initialUIState,
  initialAIState,
});
