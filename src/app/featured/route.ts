import { GET as artstation } from "./artstation/route";
import { GET as github } from "./github/route";
import { GET as researchgate } from "./researchgate/route";

export const dynamic = "force-dynamic";

export async function GET() {
  const githubResponse = await github();
  const artstationResponse = await artstation();
  const researchgateResponse = await researchgate();

  return Response.json([
    ...(await githubResponse.json()),
    ...(await artstationResponse.json()),
    ...(await researchgateResponse.json()),
  ]);
}
