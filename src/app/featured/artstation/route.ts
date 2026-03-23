import details from "@/app/assets/details.json";
import * as cheerio from "cheerio";
import { FeaturedProject, FeaturedProjects } from "../Types";

export const revalidate = 86400; // 24 hours ISR

const artstationId = details.artstation.id;

export async function GET() {
  const rssText = await fetch(
    `https://www.artstation.com/${artstationId}.rss`,
    { next: { revalidate: 86400 } },
  ).then((r) => r.text());

  const $ = cheerio.load(rssText, { xml: true });

  const projects: FeaturedProjects = $("item")
    .toArray()
    .map((el): FeaturedProject => {
      const item = $(el);
      const rawTitle = item.find("title").first().text();
      // RSS titles are formatted as "Title by Author Name"
      const title = rawTitle.replace(/\s+by\s+.+$/, "").trim();
      const description = item.find("description").first().text().trim();
      const source =
        item.find("link").first().text().trim() ||
        item.find("guid").first().text().trim();
      const createdAt = item.find("pubDate").first().text();

      // Extract the first large image URL from content:encoded
      const content = item.find("content\\:encoded").first().text();
      const content$ = cheerio.load(content);
      const thumbnail = content$("img").first().attr("src") || undefined;

      return {
        title,
        description: description || undefined,
        source,
        thumbnail,
        createdAt,
        platform: "artstation",
      };
    });

  return Response.json(projects);
}
