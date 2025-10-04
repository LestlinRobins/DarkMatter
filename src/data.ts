import type { Publication } from "./types";

// Sample NASA bioscience publications data
// In a real implementation, this would be loaded from the NASA repository
export const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Effects of Microgravity on Human Cardiovascular System",
    authors: ["Dr. Jane Smith", "Dr. John Doe"],
    year: 2023,
    abstract:
      "This study examines the long-term effects of microgravity on astronaut cardiovascular health during extended missions.",
    category: "Human Physiology",
    tags: ["cardiovascular", "microgravity", "health", "ISS"],
    citations: 45,
    connections: ["2", "5", "8"],
    position: [0, 0, 0],
  },
  {
    id: "2",
    title: "Plant Growth in Lunar Regolith Simulants",
    authors: ["Dr. Sarah Johnson", "Dr. Mike Chen"],
    year: 2023,
    abstract:
      "Investigation of various plant species ability to grow in simulated lunar soil conditions.",
    category: "Plant Biology",
    tags: ["plants", "lunar", "agriculture", "sustainability"],
    citations: 67,
    connections: ["1", "3", "9"],
    position: [5, 2, -3],
  },
  {
    id: "3",
    title: "Radiation Shielding with Biological Materials",
    authors: ["Dr. Emily Brown", "Dr. David Lee"],
    year: 2022,
    abstract:
      "Novel approaches to radiation protection using genetically modified organisms.",
    category: "Radiation Biology",
    tags: ["radiation", "protection", "GMO", "Mars"],
    citations: 89,
    connections: ["2", "4", "7"],
    position: [-4, -2, 5],
  },
  {
    id: "4",
    title: "Bone Density Loss Countermeasures in Space",
    authors: ["Dr. Robert Wilson", "Dr. Amanda Garcia"],
    year: 2023,
    abstract:
      "Development and testing of exercise protocols to prevent bone density loss in microgravity.",
    category: "Human Physiology",
    tags: ["bone health", "exercise", "countermeasures", "ISS"],
    citations: 72,
    connections: ["1", "3", "10"],
    position: [3, -4, 2],
  },
  {
    id: "5",
    title: "Microbial Life Support Systems for Long-Duration Missions",
    authors: ["Dr. Lisa Martinez", "Dr. James Taylor"],
    year: 2022,
    abstract:
      "Engineering microbial ecosystems for waste recycling and resource production in spacecraft.",
    category: "Microbiology",
    tags: ["microbes", "life support", "recycling", "closed-loop"],
    citations: 54,
    connections: ["1", "6", "11"],
    position: [-5, 3, -4],
  },
  {
    id: "6",
    title: "DNA Repair Mechanisms in Extreme Radiation",
    authors: ["Dr. Kevin Anderson", "Dr. Patricia White"],
    year: 2023,
    abstract:
      "Molecular mechanisms of DNA repair in organisms exposed to cosmic radiation levels.",
    category: "Molecular Biology",
    tags: ["DNA", "radiation", "repair", "genomics"],
    citations: 91,
    connections: ["3", "5", "12"],
    position: [6, 1, 3],
  },
  {
    id: "7",
    title: "Sleep Patterns and Circadian Rhythms in Space",
    authors: ["Dr. Michelle Thompson", "Dr. Christopher Harris"],
    year: 2022,
    abstract:
      "Analysis of astronaut sleep quality and circadian disruption during orbital missions.",
    category: "Human Physiology",
    tags: ["sleep", "circadian", "health", "performance"],
    citations: 38,
    connections: ["1", "3", "4"],
    position: [-3, 5, 1],
  },
  {
    id: "8",
    title: "Algae-Based Oxygen Production for Mars Habitats",
    authors: ["Dr. Nancy Clark", "Dr. Steven Rodriguez"],
    year: 2023,
    abstract:
      "Optimization of photosynthetic algae systems for atmospheric generation in Martian conditions.",
    category: "Plant Biology",
    tags: ["algae", "oxygen", "Mars", "ISRU"],
    citations: 63,
    connections: ["1", "2", "9"],
    position: [4, 4, -5],
  },
  {
    id: "9",
    title: "Nutritional Requirements for Deep Space Exploration",
    authors: ["Dr. Brian Lewis", "Dr. Karen Walker"],
    year: 2022,
    abstract:
      "Determining optimal nutrition strategies for multi-year space missions to outer planets.",
    category: "Nutrition",
    tags: ["nutrition", "food", "health", "deep space"],
    citations: 56,
    connections: ["2", "8", "10"],
    position: [-6, -3, -2],
  },
  {
    id: "10",
    title: "Immune System Changes During Spaceflight",
    authors: ["Dr. Jessica Hall", "Dr. Thomas Allen"],
    year: 2023,
    abstract:
      "Comprehensive study of immune response alterations in astronauts during and after spaceflight.",
    category: "Immunology",
    tags: ["immune", "health", "microgravity", "adaptation"],
    citations: 78,
    connections: ["4", "9", "1"],
    position: [2, -5, 4],
  },
  {
    id: "11",
    title: "Fungal Growth in Spacecraft Environments",
    authors: ["Dr. Daniel Young", "Dr. Rebecca King"],
    year: 2022,
    abstract:
      "Investigation of fungal contamination risks and mitigation strategies for long-duration missions.",
    category: "Microbiology",
    tags: ["fungi", "contamination", "ISS", "health"],
    citations: 42,
    connections: ["5", "12", "6"],
    position: [-2, 6, -3],
  },
  {
    id: "12",
    title: "Gene Expression Changes in Microgravity",
    authors: ["Dr. Laura Wright", "Dr. Matthew Scott"],
    year: 2023,
    abstract:
      "Transcriptomic analysis of how spaceflight alters gene expression patterns across multiple organisms.",
    category: "Molecular Biology",
    tags: ["genomics", "transcriptomics", "microgravity", "adaptation"],
    citations: 84,
    connections: ["6", "11", "3"],
    position: [5, -1, -6],
  },
];

export const categories = {
  "Human Physiology": {
    color: "#FF6B6B",
    description: "Studies on human body systems in space",
  },
  "Plant Biology": {
    color: "#4ECDC4",
    description: "Research on plants and food production",
  },
  "Radiation Biology": {
    color: "#FFE66D",
    description: "Understanding and mitigating radiation effects",
  },
  Microbiology: {
    color: "#95E1D3",
    description: "Microbial life support and contamination",
  },
  "Molecular Biology": {
    color: "#AA96DA",
    description: "Genetic and molecular responses to space",
  },
  Immunology: {
    color: "#FCBAD3",
    description: "Immune system function in space",
  },
  Nutrition: {
    color: "#F38181",
    description: "Nutritional needs for space missions",
  },
};

// Function to simulate AI-powered search
export function searchPublications(query: string): Publication[] {
  const lowerQuery = query.toLowerCase();
  return mockPublications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(lowerQuery) ||
      pub.abstract.toLowerCase().includes(lowerQuery) ||
      pub.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      pub.category.toLowerCase().includes(lowerQuery)
  );
}

// Function to get related publications
export function getRelatedPublications(pubId: string): Publication[] {
  const pub = mockPublications.find((p) => p.id === pubId);
  if (!pub) return [];
  return mockPublications.filter((p) => pub.connections.includes(p.id));
}

// Function to get statistics
export interface Statistics {
  totalPublications: number;
  totalCitations: number;
  categoriesCount: number;
  averageCitationsPerPaper: number;
  topCategory: string;
}

export function getStatistics(): Statistics {
  const totalPublications = mockPublications.length;
  const totalCitations = mockPublications.reduce(
    (sum, pub) => sum + pub.citations,
    0
  );
  const categoriesCount = Object.keys(categories).length;
  const averageCitationsPerPaper = Math.round(
    totalCitations / totalPublications
  );

  const categoryCount: Record<string, number> = {};
  mockPublications.forEach((pub) => {
    categoryCount[pub.category] = (categoryCount[pub.category] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    totalPublications,
    totalCitations,
    categoriesCount,
    averageCitationsPerPaper,
    topCategory,
  };
}
