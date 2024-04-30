export const platforms = ['github', 'gitlab', 'figma', 'deviantart'] as const;
export type Platform = (typeof platforms)[number]

export interface FeaturedProject {
  title: string;
  description?: string;
  thumbnail?: string;
  source: string;
  demo?: string;
  language?: string;
  pubDate?: string;
  interactions?: {
    stars?: number;
    forks?: number;
    comments?: number;
    likes?: number;
  }
  platform: Platform;
}