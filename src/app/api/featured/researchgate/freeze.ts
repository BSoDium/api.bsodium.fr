import details from "@/app/assets/details.json";
import path from "path";
import { fileURLToPath } from "url";
import { FeaturedProject, Loader } from "../Types";
import { closeBrowser, getBrowserManager } from "../browser";
import { freeze } from "../utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const researchgateId = details.researchgate.id;

const loader: Loader = async () => {
  const browserManager = getBrowserManager();

  try {
    const page = await browserManager.newPage();

    // Navigate to the user's research profile page
    const profileUrl = `https://www.researchgate.net/profile/${researchgateId}/research`;
    console.log(`Navigating to ${profileUrl}...`);

    await page.goto(profileUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for dynamic content to load
    console.log("Waiting for page content to load...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check if we're being shown a security challenge
    const pageTitle = await page.title();
    if (pageTitle.includes("Security") || pageTitle.includes("challenge")) {
      console.warn("ResearchGate is showing a security challenge page.");
      console.warn("Automated access is being blocked by Cloudflare.");
      await page.close();
      return [];
    }

    // Extract publication data from HTML
    const publications = await page.evaluate(() => {
      // Find the publications container
      const parent = document.querySelector(
        ".nova-legacy-o-stack.nova-legacy-o-stack--gutter-xxl.nova-legacy-o-stack--spacing-xl.nova-legacy-o-stack--show-divider"
      );

      if (!parent) {
        console.log("Could not find publications container");
        return [];
      }

      const items = parent.querySelectorAll(".nova-legacy-o-stack__item");
      console.log(`Found ${items.length} publication items`);

      const results: any[] = [];

      items.forEach((item) => {
        try {
          // Find the main link
          const link = item.querySelector(".nova-legacy-e-link");
          if (!link) {
            console.warn("No link found in publication item, skipping...");
            return;
          }

          const title = link.textContent?.trim() || "";
          const source = link.getAttribute("href") || "";

          // Find description
          const descEl = item.querySelector(
            ".nova-legacy-v-publication-item__description"
          );
          const description = descEl?.textContent?.trim() || "";

          // Find publication date
          const metaEl = item.querySelector(
            ".nova-legacy-v-publication-item__meta-data-item"
          );
          const dateText = metaEl?.textContent?.trim() || "";

          // Find publication type badge
          const badgeEl = item.querySelector(".nova-legacy-e-badge");
          const type = badgeEl?.textContent?.trim() || "";

          if (title && source) {
            results.push({
              title,
              description,
              source,
              dateText,
              type,
            });
          }
        } catch (e) {
          console.warn("Error parsing publication item:", e);
        }
      });

      return results;
    });

    await page.close();

    console.log(
      `Extracted ${publications.length} publications from ResearchGate profile`
    );

    // Transform to FeaturedProject format
    const featuredProjects: FeaturedProject[] = (publications as any[])
      .filter((p: any) => p.title && p.source && p.type !== "Presentation")
      .map((pub: any) => {
        // Parse the date
        let createdAt = new Date().toISOString();
        if (pub.dateText) {
          try {
            const parsedDate = new Date(pub.dateText);
            if (!isNaN(parsedDate.getTime())) {
              createdAt = parsedDate.toISOString();
            }
          } catch (e) {
            // Use default date if parsing fails
          }
        }

        return {
          title: pub.title,
          source: pub.source.startsWith("http")
            ? pub.source
            : `https://www.researchgate.net${pub.source}`,
          description: pub.description || "",
          createdAt,
          platform: "researchgate" as const,
        };
      });

    return featuredProjects;
  } finally {
    await closeBrowser();
  }
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "ResearchGate"));
