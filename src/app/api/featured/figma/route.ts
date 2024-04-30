import { FeaturedProject } from "../Types";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const figmaId = '999587062272131138';

export async function GET(request: Request) {
  const response = await fetch(`https://www.figma.com/api/hub_files/profile/${figmaId}`, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  }).then((response) => response.json());

  const projects: FeaturedProject[] = response?.meta.map((project: any) => {
    const latest = Object.values(project.versions).reduce((a: any, b: any) => (new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? a : b)) as any;
    
    const title = latest.name;
    const description = latest.description;
    const thumbnail = project.thumbnail_url;
    const source = `https://www.figma.com/community/file/${project.id}`;
    const pubDate = project.created_at;
    const interactions = {
      likes: project.like_count
    }

    return { title, source, description, pubDate, thumbnail, interactions, platform: 'figma' };
  });
  
  return new Response(JSON.stringify(projects));
}