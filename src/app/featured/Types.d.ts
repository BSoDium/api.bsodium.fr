export const platforms = [
  "github",
  "figma",
  "deviantart",
  "researchgate",
] as const;
export type Platform = (typeof platforms)[number];

export interface FeaturedProject {
  title: string;
  description?: string;
  thumbnail?: string;
  source: string;
  demo?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
  interactions?: {
    stars?: number;
    forks?: number;
    comments?: number;
    likes?: number;
  };
  platform: Platform;
}

export type FeaturedProjects = FeaturedProject[];

/**
 * A loader function that fetches the featured projects
 */
export type Loader = () => Promise<FeaturedProjects>;
