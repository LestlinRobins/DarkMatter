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
}

export interface CategoryInfo {
  name: string;
  color: string;
  description: string;
}
