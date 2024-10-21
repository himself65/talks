import { SentenceSplitter } from "@llamaindex/core/node-parser";
import { OpenAIEmbedding } from "@llamaindex/openai";
import { Document } from "@llamaindex/core/schema";
import { runTransformations } from "llamaindex";
import { neon } from "@neondatabase/serverless";
import { PGVectorStore } from "llamaindex/vector-store/PGVectorStore";

export const sql = neon(process.env.DATABASE_URL!);
// fixme: workaround for llamaindex-ts
// @ts-expect-error
sql.unsafe = (query: string, params: any) => {
  return sql.call(sql, query, params);
};

export const vectorStore = new PGVectorStore({
  shouldConnect: false,
  client: sql,
});

const sentenceSplitter = new SentenceSplitter();
const embedding = new OpenAIEmbedding();

export async function updateNoteEmbedding(id: string, content: string) {
  const nodes = await runTransformations(
    [
      new Document({
        id_: id,
        text: content,
      }),
    ],
    [sentenceSplitter, embedding],
  );
  nodes.forEach((node) => {
    node.id_ = node.hash;
    node.metadata.noteId = id;
  });
  await vectorStore.add(nodes);
}
