# 🔌 Integration Guide: NASA Publications API

This guide shows how to integrate real NASA bioscience publications into the 3D Knowledge Graph Explorer.

## Option 1: NASA Open Science Data Repository (OSDR)

The NASA OSDR provides access to space biology experiments and publications.

### Setup

```typescript
// src/api/nasa.ts
const NASA_API_BASE = "https://osdr.nasa.gov/osdr/data/osd/files";

interface NASAPublication {
  accession: string;
  title: string;
  description: string;
  organisms: string[];
  factors: string[];
  // ... more fields
}

export async function fetchNASAPublications(): Promise<Publication[]> {
  const response = await fetch(`${NASA_API_BASE}/search`);
  const data = await response.json();

  return data.map(transformNASAPublication);
}

function transformNASAPublication(nasaPub: NASAPublication): Publication {
  return {
    id: nasaPub.accession,
    title: nasaPub.title,
    abstract: nasaPub.description,
    // ... transform other fields
    position: generatePosition(), // Use graph layout algorithm
    connections: [], // Calculate using NLP similarity
  };
}
```

## Option 2: PubMed API for NASA-Funded Research

Search PubMed for NASA-funded bioscience publications.

### Setup

```typescript
// src/api/pubmed.ts
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export async function searchNASAPublications(query: string) {
  // Step 1: Search for IDs
  const searchUrl = `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
    query + " AND NASA[Affiliation]"
  )}&retmode=json&retmax=608`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult.idlist;

  // Step 2: Fetch details
  const fetchUrl = `${PUBMED_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(
    ","
  )}&retmode=xml`;
  const fetchRes = await fetch(fetchUrl);
  const xml = await fetchRes.text();

  return parsePublications(xml);
}
```

## Option 3: Web Scraping NASA Publications List

If the publications are in a CSV/Excel file:

```typescript
// src/utils/parser.ts
import Papa from "papaparse";

export async function parseNASACSV(file: File): Promise<Publication[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const publications = results.data.map((row) => ({
          id: row.ID,
          title: row.Title,
          authors: row.Authors.split(";"),
          year: parseInt(row.Year),
          abstract: row.Abstract,
          category: categorizePublication(row),
          tags: extractTags(row),
          citations: parseInt(row.Citations) || 0,
          connections: [],
          position: [0, 0, 0], // Will be calculated
        }));

        resolve(publications);
      },
    });
  });
}
```

## Automatic Relationship Detection

Use NLP to find connections between publications:

```typescript
// src/utils/nlp.ts
import Sentiment from "sentiment";

export function calculateSimilarity(
  pub1: Publication,
  pub2: Publication
): number {
  // Simple keyword-based similarity
  const text1 = `${pub1.title} ${pub1.abstract}`.toLowerCase();
  const text2 = `${pub2.title} ${pub2.abstract}`.toLowerCase();

  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size; // Jaccard similarity
}

export function findConnections(
  pub: Publication,
  allPubs: Publication[]
): string[] {
  const similarities = allPubs
    .filter((p) => p.id !== pub.id)
    .map((p) => ({
      id: p.id,
      score: calculateSimilarity(pub, p),
    }))
    .sort((a, b) => b.score - a.score);

  // Return top 5 most similar
  return similarities.slice(0, 5).map((s) => s.id);
}
```

## Advanced: OpenAI Integration for Smart Summaries

```typescript
// src/api/openai.ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePublicationSummary(
  pub: Publication
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a NASA science communicator. Summarize research papers for mission planners.",
      },
      {
        role: "user",
        content: `Summarize this publication in 2-3 sentences for mission planners:
        
        Title: ${pub.title}
        Abstract: ${pub.abstract}
        
        Focus on: key findings, mission relevance, and actionable insights.`,
      },
    ],
    max_tokens: 150,
  });

  return response.choices[0].message.content || pub.abstract;
}

export async function findResearchGaps(
  publications: Publication[]
): Promise<string[]> {
  const categories = publications.map((p) => p.category);
  const tags = publications.flatMap((p) => p.tags);

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a NASA research strategist analyzing bioscience publications.",
      },
      {
        role: "user",
        content: `Given these research areas and topics, identify 5 critical gaps in NASA's bioscience research:
        
        Categories: ${[...new Set(categories)].join(", ")}
        Common topics: ${[...new Set(tags)].slice(0, 30).join(", ")}
        
        Consider: human health, plant biology, radiation, life support, long-duration missions.`,
      },
    ],
  });

  const gaps = response.choices[0].message.content
    ?.split("\n")
    .filter((line) => line.trim());
  return gaps || [];
}
```

## Graph Layout Algorithm

Position publications in 3D space based on relationships:

```typescript
// src/utils/layout.ts
export function forceDirectedLayout(
  publications: Publication[],
  iterations: number = 100
): void {
  const positions = new Map<string, [number, number, number]>();

  // Initialize random positions
  publications.forEach((pub) => {
    positions.set(pub.id, [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    ]);
  });

  // Force-directed iterations
  for (let i = 0; i < iterations; i++) {
    const forces = new Map<string, [number, number, number]>();

    // Initialize forces
    publications.forEach((pub) => forces.set(pub.id, [0, 0, 0]));

    // Repulsion between all nodes
    for (const pub1 of publications) {
      for (const pub2 of publications) {
        if (pub1.id === pub2.id) continue;

        const pos1 = positions.get(pub1.id)!;
        const pos2 = positions.get(pub2.id)!;
        const force1 = forces.get(pub1.id)!;

        const dx = pos1[0] - pos2[0];
        const dy = pos1[1] - pos2[1];
        const dz = pos1[2] - pos2[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

        const repulsion = 0.5 / (distance * distance);
        force1[0] += (dx / distance) * repulsion;
        force1[1] += (dy / distance) * repulsion;
        force1[2] += (dz / distance) * repulsion;
      }
    }

    // Attraction between connected nodes
    for (const pub of publications) {
      const pos1 = positions.get(pub.id)!;
      const force1 = forces.get(pub.id)!;

      for (const connId of pub.connections) {
        const pos2 = positions.get(connId);
        if (!pos2) continue;

        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        const dz = pos2[2] - pos1[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const attraction = distance * 0.01;
        force1[0] += dx * attraction;
        force1[1] += dy * attraction;
        force1[2] += dz * attraction;
      }
    }

    // Apply forces
    publications.forEach((pub) => {
      const pos = positions.get(pub.id)!;
      const force = forces.get(pub.id)!;

      pos[0] += force[0];
      pos[1] += force[1];
      pos[2] += force[2];
    });
  }

  // Update publication positions
  publications.forEach((pub) => {
    pub.position = positions.get(pub.id)!;
  });
}
```

## Integration Steps

1. **Choose your data source** (OSDR, PubMed, or CSV)
2. **Implement the fetcher** using the examples above
3. **Update App.tsx**:

   ```typescript
   useEffect(() => {
     fetchNASAPublications().then((pubs) => {
       // Calculate connections
       pubs.forEach((pub) => {
         pub.connections = findConnections(pub, pubs);
       });

       // Calculate layout
       forceDirectedLayout(pubs);

       setPublications(pubs);
     });
   }, []);
   ```

4. **Add loading state** for better UX
5. **Implement caching** to avoid repeated API calls
6. **Add error handling** for network issues

## Performance Considerations

For 608 publications:

- Use **instanced rendering** for better performance
- Implement **LOD (Level of Detail)** - show simplified models when zoomed out
- Add **frustum culling** - only render visible publications
- Use **Web Workers** for graph calculations
- Cache results in **IndexedDB** for offline access

## Required Packages

```bash
npm install papaparse openai @types/papaparse
```

Good luck with your NASA Space Apps Challenge! 🚀
