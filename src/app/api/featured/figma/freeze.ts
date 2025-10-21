import details from "@/app/assets/details.json";
import path from "path";
import { fileURLToPath } from "url";
import { FeaturedProject, Loader } from "../Types";
import { closeBrowser, getBrowserManager } from "../browser";
import { freeze } from "../utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const figmaId = details.figma.id;

const loader: Loader = async () => {
  const browserManager = getBrowserManager();

  try {
    const page = await browserManager.newPage();

    // Navigate to the user's profile page
    const profileUrl = `https://www.figma.com/@${figmaId}`;
    console.log(`Navigating to ${profileUrl}...`);

    await page.goto(profileUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for dynamic content to load
    console.log("Waiting for page content to load...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Extract project data from HTML
    const projects = await page.evaluate((userId) => {
      // Find all links that point to community files
      const allLinks = Array.from(document.querySelectorAll("a"));
      const fileLinks = allLinks.filter(
        (a) => a.href.includes("/community/file/") || a.href.includes("/file/")
      );

      console.log(`Found ${fileLinks.length} file links on the page`);

      // Deduplicate by href and extract data
      const uniqueFiles = new Map<string, any>();

      fileLinks.forEach((link) => {
        const href = link.href;
        if (uniqueFiles.has(href)) return;

        // Get the link's text content as title
        const title = link.textContent?.trim() || "";

        // Try to find associated metadata by traversing up the DOM
        let container = link.closest(
          '[class*="card"], [class*="item"], article, div'
        );

        // Look for the author
        let author = "figma";
        if (container) {
          const authorEl = container.querySelector(`[href="/@${userId}"]`);
          if (authorEl) {
            author = userId;
          }
        }

        // Look for thumbnail in the container
        let thumbnail = "";
        if (container) {
          const img = container.querySelector("img");
          if (img) {
            thumbnail = img.src || img.getAttribute("src") || "";
          }
        }

        // Look for description
        let description = "";
        if (container) {
          const descEl = container.querySelector('p, [class*="description"]');
          if (descEl && descEl !== link) {
            description = descEl.textContent?.trim() || "";
          }
        }

        // Look for likes/interactions
        let likes = 0;
        if (container) {
          const likeEl = container.querySelector(
            '[class*="like"], [class*="heart"]'
          );
          if (likeEl) {
            const likeText = likeEl.textContent?.trim() || "0";
            likes = parseInt(likeText.replace(/\D/g, "")) || 0;
          }
        }

        if (title && href.includes("/community/file/")) {
          uniqueFiles.set(href, {
            title,
            description,
            thumbnail,
            source: href,
            author,
            interactions: { likes },
          });
        }
      });

      return Array.from(uniqueFiles.values());
    }, figmaId);

    await page.close();

    console.log(`Extracted ${projects.length} projects from Figma profile`);

    // Transform to FeaturedProject format
    const featuredProjects: FeaturedProject[] = (projects as any[])
      .filter((p: any) => p.title && p.source && p.author === figmaId)
      .map((project: any) => ({
        title: project.title,
        source: project.source,
        description: project.description || "",
        thumbnail: project.thumbnail || "",
        interactions: project.interactions,
        platform: "figma" as const,
      }));

    return featuredProjects;
  } finally {
    await closeBrowser();
  }
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "Figma"));
