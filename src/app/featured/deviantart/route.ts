import details from "@/app/assets/details.json";
import * as cheerio from "cheerio";
import { FeaturedProject, FeaturedProjects } from "../Types";

export const revalidate = 86400; // 24 hours ISR

const deviantartId = details.deviantart.id;

export async function GET() {
  const apiText = await fetch(
    `https://backend.deviantart.com/rss.xml?q=gallery:${deviantartId}`,
    { next: { revalidate: 86400 } },
  ).then((r) => r.text());
  const api$ = cheerio.load(apiText, { xml: true });

  const galleryText = await fetch(
    `https://www.deviantart.com/${deviantartId}/gallery`,
    { next: { revalidate: 86400 } },
  ).then((r) => r.text());
  const gallery$ = cheerio.load(galleryText);

  const projects: FeaturedProject[] = api$("item")
    .toArray()
    .map((el) => {
      const item = api$(el);
      const title = item.find("title").first().text();
      const description = item.find("media\\:description").first().text();
      const source = item.find("guid").first().text();
      const createdAt = item.find("pubDate").first().text();
      const thumbnail = item.find("media\\:thumbnail").last().attr("url") || "";

      return {
        title,
        source,
        description,
        createdAt,
        thumbnail,
        platform: "deviantart" as const,
      };
    });

  const galleryProjects = gallery$('div[data-testid="content_row"]')
    .children()
    .toArray()
    .map((el) => {
      const item = gallery$(el);
      const title = item.find("h2").first().text();
      const likes = item.find("button").first().text();

      return {
        title,
        interactions: {
          likes: parseInt(likes),
        },
      };
    });

  projects.forEach((project) => {
    const galleryProject = galleryProjects.find(
      (gp) => gp.title === project.title,
    );
    if (galleryProject) {
      project.interactions = galleryProject.interactions;
    }
  });

  return Response.json(projects as FeaturedProjects);
}
