export const platforms = [
  "github",
  "artstation",
  /**
   * @deprecated Figma integration has been removed. Kept for backwards compatibility.
   * @todo Remove this once the frontend no longer depends on it.
   */
  "figma",
  /**
   * @deprecated DeviantArt integration replaced by ArtStation. Kept for backwards compatibility.
   * @todo Remove this once the frontend no longer depends on it.
   */
  "deviantart",
  /**
   * @deprecated ResearchGate integration has been removed. Kept for backwards compatibility.
   * @todo Remove this once the frontend no longer depends on it.
   */
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
  adultContent?: boolean;
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
