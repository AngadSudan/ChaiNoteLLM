import { QdrantVectorStore } from "@langchain/qdrant";
import type { Document } from "@langchain/core/documents";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { OpenAIEmbeddings } from "@langchain/openai";

/**
 * Stores documents into Qdrant and returns the created vector store
 * @param docs LangChain Documents (already chunked/split)
 */
export const storeIntoDB = async (
  docs: Document[],
  embeddings: EmbeddingsInterface,
  collection: string
) => {
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: process.env.QDRANT_ENDPOINT || "http://localhost:6333",
    apiKey: process.env.QDRANT_API_KEY,
    collectionName: collection,
  });

  return vectorStore;
};

export async function getVectorStore(userCollection: string) {
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_ENDPOINT || "http://localhost:6333",
      collectionName: userCollection,
    }
  );

  return vectorStore;
}
