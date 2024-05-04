import path from "path";
import { FeaturedProject, Loader } from "../Types";
import { freeze } from "../utils";

const figmaId = "999587062272131138";

const loader: Loader = async () => {
  const response = await fetch(
    `https://www.figma.com/api/hub_files/profile/${figmaId}`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    }
  ).then((response) => response.json());

  const projects: FeaturedProject[] = response?.meta.map((project: any) => {
    const latest = Object.values(project.versions).reduce((a: any, b: any) =>
      new Date(a.created_at).getTime() > new Date(b.created_at).getTime()
        ? a
        : b
    ) as any;

    const title = latest.name;
    const description = latest.description;
    const thumbnail = project.thumbnail_url;
    const source = `https://www.figma.com/community/file/${project.id}`;
    const createdAt = project.created_at;
    const updatedAt = latest.created_at;
    const interactions = {
      likes: project.like_count,
    };

    return {
      title,
      source,
      description,
      createdAt,
      updatedAt,
      thumbnail,
      interactions,
      platform: "figma",
    };
  });

  return projects;
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "Figma"));
