import { SentenceSplitter } from "@llamaindex/core/node-parser";
import { OpenAIEmbedding } from "@llamaindex/openai";
import { Document } from "@llamaindex/core/schema";
import { runTransformations } from "llamaindex";
import { neon } from "@neondatabase/serverless";
import { PGVectorStore } from "llamaindex/vector-store/PGVectorStore";
import { v5 } from "uuid";

const DOCUMENT_NAMESPACE = "47f8b5b2-c435-46f7-bdbf-32b7f817d97c";

export const sql = neon(process.env.DATABASE_URL!);
// fixme: workaround for llamaindex-ts, neon API is different with npm:postgres
// @ts-expect-error
sql.unsafe = (query: string, params: any) => {
  return sql.call(sql, query, params);
};
// @ts-expect-error
sql.begin = async (fn: any) => {
  try {
    await sql("BEGIN");
    await fn(sql);
  } catch (err) {
    await sql("ROLLBACK");
    throw err;
  }
};

export const vectorStore = new PGVectorStore({
  shouldConnect: false,
  client: sql,
});

const sentenceSplitter = new SentenceSplitter();
// todo: HTMLNodeParser is missing in llamaindex
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
  nodes.forEach((node, idx) => {
    node.id_ = v5(`${id}-${idx}`, DOCUMENT_NAMESPACE);
    node.metadata.noteId = id;
  });
  await vectorStore.add(nodes);
}
