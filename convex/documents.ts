import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const upsertMany = mutation({
  args: {
    docs: v.array(
      v.object({
        externalId: v.string(),
        title: v.string(),
        authors: v.array(v.string()),
        publicationDate: v.optional(v.union(v.string(), v.null())),
        year: v.optional(v.union(v.number(), v.null())),
        path: v.optional(v.union(v.string(), v.null())),
        summary: v.optional(v.union(v.string(), v.null())),
        number: v.optional(v.string()),
        embedding: v.array(v.float64()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const d of args.docs) {
      console.log("upsertMany:in", {
        externalId: d.externalId,
        authorsLen: d.authors.length,
        hasYear: d.year != null,
        hasPubDate: d.publicationDate != null,
      });
      const existingDoc = await ctx.db
        .query("documents")
        .withIndex("by_externalId", (q) => q.eq("externalId", d.externalId))
        .unique();

      const existingEmb = await ctx.db
        .query("docEmbeddings")
        .withIndex("by_externalId", (q) => q.eq("externalId", d.externalId))
        .unique();

      let embeddingId = existingEmb?._id;

      if (!existingEmb) {
        embeddingId = await ctx.db.insert("docEmbeddings", {
          externalId: d.externalId,
          embedding: d.embedding,
        });
      } else {
        await ctx.db.patch(existingEmb._id, { embedding: d.embedding });
      }

      const base: {
        externalId: string;
        title: string;
        authors: string[];
        embeddingId?: Id<"docEmbeddings">;
        publicationDate?: string;
        year?: number;
        path?: string;
        summary?: string;
        number?: string;
      } = {
        externalId: d.externalId,
        title: d.title,
        authors: d.authors,
        embeddingId,
      };
      if (d.publicationDate != null) base.publicationDate = d.publicationDate;
      if (d.year != null) base.year = d.year;
      if (d.path != null) base.path = d.path;
      if (d.summary != null) base.summary = d.summary;
      if (d.number != null) base.number = d.number;

      if (!existingDoc) {
        await ctx.db.insert("documents", base);
      } else {
        await ctx.db.patch(existingDoc._id, base);
      }
    }
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").collect();
    return docs.map((d) => ({
      _id: d._id,
      externalId: d.externalId,
      title: d.title,
      number: d.number ?? null,
    }));
  },
});

export const backfillMeta = mutation({
  args: {
    updates: v.array(
      v.object({
        externalId: v.string(),
        title: v.optional(v.string()),
        authors: v.optional(v.array(v.string())),
        publicationDate: v.optional(v.string()),
        year: v.optional(v.number()),
        path: v.optional(v.string()),
        summary: v.optional(v.string()),
        number: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const u of args.updates) {
      const doc = await ctx.db
        .query("documents")
        .withIndex("by_externalId", (q) => q.eq("externalId", u.externalId))
        .unique();
      if (!doc) continue;
      const patch: Partial<{
        title: string;
        authors: string[];
        publicationDate: string;
        year: number;
        path: string;
        summary: string;
        number: string;
      }> = {};
      if (u.title != null) patch.title = u.title;
      if (u.authors != null) patch.authors = u.authors;
      if (u.publicationDate != null) patch.publicationDate = u.publicationDate;
      if (u.year != null) patch.year = u.year;
      if (u.path != null) patch.path = u.path;
      if (u.summary != null) patch.summary = u.summary;
      if (u.number != null) patch.number = u.number;
      if (Object.keys(patch).length) await ctx.db.patch(doc._id, patch);
    }
  },
});


