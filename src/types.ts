export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  category: string;
  tags: string[];
  citations: number;
  connections: string[]; // IDs of related publications
  position: [number, number, number]; // 3D position
  constellationId?: string; // ID of the constellation/galaxy this publication belongs to
}

export interface Constellation {
  id: string;
  name: string;
  publications: Publication[];
  center: [number, number, number];
  color: string;
  category: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
  description: string;
}
