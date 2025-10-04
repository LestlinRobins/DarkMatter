import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    externalId: v.string(),
    title: v.string(),
    authors: v.array(v.string()),
    publicationDate: v.optional(v.string()),
    year: v.optional(v.number()),
    path: v.optional(v.string()),
    summary: v.optional(v.string()),
    number: v.optional(v.string()),
    embeddingId: v.optional(v.id("docEmbeddings")),
  }).index("by_externalId", ["externalId"]).index("by_embeddingId", ["embeddingId"]).index("by_number", ["number"]),
  docEmbeddings: defineTable({
    externalId: v.string(),
    embedding: v.array(v.float64()),
  })
    .index("by_externalId", ["externalId"]) 
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
    }),
});
