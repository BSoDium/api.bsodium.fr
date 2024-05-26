import details from "app/assets/details.json";
import path from "path";
import { Loader } from "../Types";
import { freeze } from "../utils";
import { Repository } from "./Types";

const githubId = details.github.id;

const loader: Loader = async () => {
  const response = await fetch(
    `https://api.github.com/users/${githubId}/repos`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    }
  ).then((response) => response.json());

  if (!Array.isArray(response)) {
    console.warn("Unexpected response from GitHub: ", response);
    return [];
  }

  return response
    ?.filter((repository: Repository) => repository.topics.includes("featured"))
    .map((repository: Repository) => ({
      title: repository.name.replace(/-/g, " "),
      description: repository.description,
      source: repository.html_url,
      demo: repository.homepage,
      language: repository.language,
      platform: "github",
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
      interactions: {
        stars: repository.stargazers_count,
        forks: repository.forks,
      },
    }));
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "GitHub"));
