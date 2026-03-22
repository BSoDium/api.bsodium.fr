import details from "@/app/assets/details.json";
import { FeaturedProjects } from "../Types";
import { Repository } from "./Types";

export const revalidate = 86400; // 24 hours ISR

const githubId = details.github.id;

export async function GET() {
  const response = await fetch(
    `https://api.github.com/users/${githubId}/repos`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      next: { revalidate: 86400 },
    },
  ).then((r) => r.json());

  if (!Array.isArray(response)) {
    console.warn("Unexpected response from GitHub: ", response);
    return Response.json([] as FeaturedProjects);
  }

  const projects: FeaturedProjects = response
    .filter((repo: Repository) => repo.topics.includes("featured"))
    .map((repo: Repository) => ({
      title: repo.name.replace(/-/g, " "),
      description: repo.description,
      source: repo.html_url,
      demo: repo.homepage,
      language: repo.language,
      platform: "github" as const,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      interactions: {
        stars: repo.stargazers_count,
        forks: repo.forks,
      },
    }));

  return Response.json(projects);
}
