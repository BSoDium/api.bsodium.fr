import { GET as deviantart } from './deviantart/route';
import { GET as figma } from './figma/route';
import { GET as github } from './github/route';
import { GET as researchgate } from './researchgate/route';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const githubResponse = await github(request);
  const researchgateResponse = await researchgate(request);
  const deviantartResponse = await deviantart(request);
  const figmaResponse = await figma(request);

  return new Response(JSON.stringify([
    ...await githubResponse.json(),
    ...await researchgateResponse.json(),
    ...await deviantartResponse.json(),
    ...await figmaResponse.json()
  ]));
}