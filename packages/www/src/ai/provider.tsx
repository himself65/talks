"use server";
import { VectorStoreIndex, MetadataMode, ChatMessage } from "llamaindex";
import { PGVectorStore } from "llamaindex/vector-store/PGVectorStore";
import { createAI } from "ai/rsc";
import { sql } from "../lib/sql";

const vectorStore = new PGVectorStore({
  shouldConnect: false,
  client: sql,
});

// Split text and create embeddings. Store them in a VectorStoreIndex
const index = await VectorStoreIndex.fromVectorStore(vectorStore);

const initialAIState = {};

const initialUIState = {
  messages: [],
} as {
  messages: ChatMessage[];
};

export const AI = createAI({
  actions: {
    submitUserMessage: async (message: string) => {
      "use server";
    },
    query: async (query: string) => {
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
