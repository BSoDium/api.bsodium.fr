import { FeaturedProjects } from "../Types";

export const revalidate = 86400;

/**
 * @deprecated ResearchGate integration has been removed due to aggressive
 * anti-bot measures. This endpoint returns an empty array for backwards
 * compatibility and should be removed once the frontend no longer depends on it.
 */
export async function GET() {
  return Response.json([] as FeaturedProjects);
}
