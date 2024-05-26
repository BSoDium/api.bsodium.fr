import details from "app/assets/details.json";
import { JSDOM } from "jsdom";
import path from "path";
import { FeaturedProject, Loader } from "../Types";
import { freeze } from "../utils";

const deviantartId = details.deviantart.id;

const loader: Loader = async () => {
  const apiText = await fetch(
    `https://backend.deviantart.com/rss.xml?q=gallery:${deviantartId}`
  ).then((response) => response.text());
  const apiDom = new JSDOM(apiText);
  const apiXmlDoc = apiDom.window.document;

  const galleryText = await fetch(
    `https://www.deviantart.com/${deviantartId}/gallery`
  ).then((response) => response.text());
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
      platform: "deviantart",
    };
  });

  const galleryRows = galleryXmlDoc.querySelectorAll(
    'div[data-testid="content_row"]'
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
      (galleryProject) => galleryProject.title === project.title
    );
    if (galleryProject) {
      project.interactions = galleryProject.interactions;
    }
  });

  return projects;
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "DeviantArt"));
