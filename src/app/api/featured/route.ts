import { GET as deviantart } from "./deviantart/route";
import { GET as figma } from "./figma/route";
import { GET as github } from "./github/route";
import { GET as researchgate } from "./researchgate/route";

export const dynamic = "force-dynamic";

export async function GET() {
  const githubResponse = await github();
  const researchgateResponse = await researchgate();
  const deviantartResponse = await deviantart();
  const figmaResponse = await figma();

  return new Response(
    JSON.stringify([
      ...(await githubResponse.json()),
      ...(await researchgateResponse.json()),
      ...(await deviantartResponse.json()),
      ...(await figmaResponse.json()),
    ])
  );
}
