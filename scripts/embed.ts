import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const DATA_DIR = path.resolve(__dirname, "../data");
const SUMMARY_PATH = path.resolve(__dirname, "../summary.json");
const CONVEX_URL = process.env.VITE_CONVEX_URL || "";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

const MAX_EMBED_BYTES = 30000;

const readJson = async <T>(p: string): Promise<T | null> => {
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const walk = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile() && full.endsWith(".md")) out.push(full);
  }
  return out;
};

const read = async (p: string) => {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return "";
  }
};

const chunk = <T>(arr: T[], size: number) => {
  const groups: T[][] = [];
  for (let i = 0; i < arr.length; i += size) groups.push(arr.slice(i, i + size));
  return groups;
};

interface SummaryItem {
  id?: string;
  externalId?: string;
  title?: string;
  authors?: string[];
  publication_date?: string;
  publicationDate?: string;
  year?: number;
  summary?: string;
}

interface DocMeta {
  externalId: string;
  title: string;
  authors: string[];
  publicationDate: string | null;
  year: number | null;
  summary: string | null;
}

const toMap = (items: SummaryItem[]) => {
  const m = new Map<string, DocMeta>();
  for (const it of items) {
    const id = String(it.id ?? it.externalId ?? "");
    if (!id) continue;
    m.set(id, {
      externalId: id,
      title: it.title || "",
      authors: Array.isArray(it.authors) ? it.authors : [],
      publicationDate: it.publication_date ?? it.publicationDate ?? null,
      year: it.year ?? null,
      summary: it.summary ?? null,
    });
  }
  return m;
};

const textBytes = (s: string) => new TextEncoder().encode(s).length;

const splitByBytes = (s: string, maxBytes: number) => {
  if (textBytes(s) <= maxBytes) return [s];
  const parts: string[] = [];
  const paras = s.split(/\n{2,}/);
  let buf = "";
  for (const p of paras) {
    const cand = buf ? `${buf}\n\n${p}` : p;
    if (textBytes(cand) <= maxBytes) buf = cand;
    else {
      if (buf) parts.push(buf);
      if (textBytes(p) <= maxBytes) buf = p;
      else {
        let start = 0;
        const bytes = new TextEncoder().encode(p);
        while (start < bytes.length) {
          const end = Math.min(start + maxBytes, bytes.length);
          parts.push(new TextDecoder().decode(bytes.slice(start, end)));
          start = end;
        }
        buf = "";
      }
    }
  }
  if (buf) parts.push(buf);
  return parts;
};

const avg = (vecs: number[][]) => {
  if (!vecs.length) return [] as number[];
  const out = new Array(vecs[0].length).fill(0);
  for (const v of vecs) for (let i = 0; i < out.length; i++) out[i] += v[i] || 0;
  for (let i = 0; i < out.length; i++) out[i] /= vecs.length;
  return out;
};

const embedBatch = async (apiKey: string, texts: string[]) => {
  const gen = new GoogleGenerativeAI(apiKey);
  const model = gen.getGenerativeModel({ model: "text-embedding-004" });
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    const t = texts[i];
    const chunks = splitByBytes(t, MAX_EMBED_BYTES);
    console.log(`embedding doc ${i + 1}/${texts.length} (${chunks.length} chunks)`);
    
    const vecs: number[][] = [];
    for (let j = 0; j < chunks.length; j++) {
      const c = chunks[j];
      console.log(`  chunk ${j + 1}/${chunks.length} (${textBytes(c)} bytes)`);
      const r = await model.embedContent(c);
      vecs.push((r?.embedding?.values || []).map(Number));
    }
    out.push(avg(vecs));
  }
  return out;
};

interface DocPayload {
  externalId: string;
  title: string;
  authors: string[];
  publicationDate?: string;
  year?: number;
  path: string;
  summary?: string;
  embedding: number[];
}

const run = async () => {
  if (!CONVEX_URL) throw new Error("Missing CONVEX_URL");
  if (!GOOGLE_API_KEY) throw new Error("Missing GOOGLE_API_KEY");

  console.log("starting embedding process...");
  
  const client = new ConvexHttpClient(CONVEX_URL);
  const summary = (await readJson<SummaryItem[]>(SUMMARY_PATH)) || [];
  const meta = toMap(summary);
  const files = await walk(DATA_DIR);
  
  console.log(`found ${files.length} markdown files`);
  console.log(`loaded ${meta.size} metadata entries`);

  let sent = 0;
  const totalBatches = Math.ceil(files.length / 32);
  
  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    const group = chunk(files, 32)[batchIdx];
    console.log(`\nprocessing batch ${batchIdx + 1}/${totalBatches} (${group.length} files)`);
    
    const docs = await Promise.all(
      group.map(async (p) => {
        const text = await read(p);
        const name = path.basename(p, ".md");
        const m = meta.get(name) || {
          externalId: name,
          title: name,
          authors: [],
          publicationDate: null,
          year: null,
          summary: null,
        };
        return { meta: m, text, path: path.relative(path.resolve(__dirname, ".."), p) };
      })
    );

    console.log("generating embeddings...");
    const vectors = await embedBatch(GOOGLE_API_KEY, docs.map((d) => d.text));

    const payload: DocPayload[] = docs.map((d, i) => {
      const base: DocPayload = {
        externalId: d.meta.externalId,
        title: d.meta.title || d.meta.externalId,
        authors: d.meta.authors || [],
        path: d.path,
        embedding: vectors[i] || [],
      };
      
      if (d.meta.publicationDate) base.publicationDate = d.meta.publicationDate;
      if (d.meta.year) base.year = d.meta.year;
      if (d.meta.summary) base.summary = d.meta.summary;
      
      return base;
    });

    console.log("uploading to convex...");
    await client.mutation(api.documents.upsertMany, { docs: payload });
    sent += payload.length;
    console.log(`✓ uploaded ${payload.length} docs (total: ${sent}/${files.length})`);
  }
};

run().then(() => console.log("done"));


