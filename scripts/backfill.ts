import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const SUMMARY_PATH = path.resolve(__dirname, "../summary.json");
const CONVEX_URL = process.env.VITE_CONVEX_URL || "";

type SummaryItem = {
  id?: string;
  externalId?: string;
  title?: string;
  authors?: string[];
  publication_date?: string;
  publicationDate?: string;
  year?: number;
  summary?: string;
};

type BackfillUpdate = {
  externalId: string;
  title?: string;
  authors?: string[];
  publicationDate?: string;
  year?: number;
  path?: string;
  summary?: string;
  number?: string;
};

const readJson = async <T>(p: string): Promise<T> => {
  const raw = await fs.readFile(p, "utf-8");
  return JSON.parse(raw) as T;
};

const toMap = (items: SummaryItem[]) => {
  const m = new Map<string, SummaryItem>();
  for (const it of items) {
    const id = String(it.id ?? it.externalId ?? "");
    if (!id) continue;
    m.set(id, it);
  }
  return m;
};

const pad3 = (n: number) => n.toString().padStart(3, "0");

const run = async () => {
  if (!CONVEX_URL) throw new Error("Missing CONVEX_URL");

  const client = new ConvexHttpClient(CONVEX_URL);
  const summary = await readJson<SummaryItem[]>(SUMMARY_PATH);
  const meta = toMap(summary);

  const existing = await client.query(api.documents.list, {});

  const updates: BackfillUpdate[] = [];
  for (const d of existing) {
    const match = /^([0-9]{3})[_-]?/.exec(d.title || "");
    const num = match ? match[1] : undefined;
    const idKey = num ?? d.externalId;
    const s = meta.get(idKey);

    const u: BackfillUpdate = { externalId: d.externalId };
    if (!d.title && s?.title) u.title = s.title;
    if (Array.isArray(s?.authors) && s!.authors!.length) u.authors = s!.authors!;
    if (s?.publication_date || s?.publicationDate) u.publicationDate = s.publication_date ?? s.publicationDate;
    if (typeof s?.year === "number") u.year = s.year!;
    if (s?.summary) u.summary = s.summary;
    if (num) u.number = num;

    if (Object.keys(u).length > 1) updates.push(u);
  }

  if (!updates.length) {
    console.log("no updates needed");
    return;
  }

  const batchSize = 64;
  for (let i = 0; i < updates.length; i += batchSize) {
    const chunk = updates.slice(i, i + batchSize);
    console.log(`updating ${chunk.length} docs (${i + chunk.length}/${updates.length})`);
    await client.mutation(api.documents.backfillMeta, { updates: chunk });
  }

  console.log("done");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


