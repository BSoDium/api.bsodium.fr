import { getCachedProjects } from "../cache";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await getCachedProjects("researchgate");
  return Response.json(projects);
}
