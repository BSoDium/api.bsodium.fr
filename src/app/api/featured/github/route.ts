import { FeaturedProject } from "../Types";
import { Repository } from "./Types";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const githubId = 'bsodium';

export async function GET(request: Request) {
  const response = await fetch(`https://api.github.com/users/${githubId}/repos`, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  }).then((response) => response.json());

  const projects: FeaturedProject[] = response?.filter((repository: Repository) => repository.topics.includes('featured')).map((repository: Repository) => ({
    title: repository.name,
    description: repository.description,
    source: repository.html_url,
    demo: repository.homepage,
    language: repository.language,
    platform: 'github',
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    interactions: {
      stars: repository.stargazers_count,
      forks: repository.forks,
    },
  }));
  
  return new Response(JSON.stringify(projects));
}