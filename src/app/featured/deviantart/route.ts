import details from "@/app/assets/details.json";
import { JSDOM } from "jsdom";
import { FeaturedProject, FeaturedProjects } from "../Types";

export const revalidate = 86400; // 24 hours ISR

const deviantartId = details.deviantart.id;

export async function GET() {
  const apiText = await fetch(
    `https://backend.deviantart.com/rss.xml?q=gallery:${deviantartId}`,
    { next: { revalidate: 86400 } },
  ).then((r) => r.text());
  const apiDom = new JSDOM(apiText);
  const apiXmlDoc = apiDom.window.document;

  const galleryText = await fetch(
    `https://www.deviantart.com/${deviantartId}/gallery`,
    { next: { revalidate: 86400 } },
  ).then((r) => r.text());
  const galleryDom = new JSDOM(galleryText);
  const galleryXmlDoc = galleryDom.window.document;

  const apiItems = apiXmlDoc.getElementsByTagName("item");
  const projects: FeaturedProject[] = Array.from(apiItems).map((item) => {
    const title = item.getElementsByTagName("title")[0].textContent || "";
    const description =
      item.getElementsByTagName("media:description")[0].textContent || "";
    const source = item.getElementsByTagName("guid")[0].textContent || "";
    const createdAt = item.getElementsByTagName("pubDate")[0].textContent || "";
    const thumbnails = item.getElementsByTagName("media:thumbnail");
    const thumbnail =
      thumbnails[thumbnails.length - 1].getAttribute("url") || "";

    return {
      title,
      source,
      description,
      createdAt,
      thumbnail,
      platform: "deviantart" as const,
    };
  });

  const galleryRows = galleryXmlDoc.querySelectorAll(
    'div[data-testid="content_row"]',
  );
  const galleryProjects = Array.from(galleryRows || [])
    .map((row) => Array.from(row.children))
    .flat()
    .map((item) => {
      const title = item.getElementsByTagName("h2")[0].textContent || "";
      const likes = item.getElementsByTagName("button")[0].textContent || "";

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
