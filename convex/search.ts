import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const fetchByEmbeddingIds = internalQuery({
  args: { ids: v.array(v.id("docEmbeddings")) },
  handler: async (ctx, args): Promise<Array<Doc<"documents">>> => {
    const results: Array<Doc<"documents">> = [];
    for (const id of args.ids) {
      const doc = await ctx.db
        .query("documents")
        .withIndex("by_embeddingId", (q) => q.eq("embeddingId", id))
        .unique();
      if (doc) results.push(doc);
    }
    return results;
  },
});

async function embedWithGemini(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_API_KEY as string;
  if (!apiKey) throw new Error("GOOGLE_API_KEY missing");
  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({ model: "text-embedding-004" });
  const res = await model.embedContent(text);
  const values = res?.embedding?.values ?? [];
  return values.map((x: number) => Number(x));
}

export const vecSearch = action({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Array<Doc<"documents">>> => {
    const vector = await embedWithGemini(args.query);
    const results = await ctx.vectorSearch("docEmbeddings", "by_embedding", {
      vector,
      limit: Math.min(Math.max(args.limit ?? 10, 1), 256),
    });
    const docs: Array<Doc<"documents">> = await ctx.runQuery(internal.search.fetchByEmbeddingIds, {
      ids: results.map((r) => r._id),
    });
    return docs;
  },
});


