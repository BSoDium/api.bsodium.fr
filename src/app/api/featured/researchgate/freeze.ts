import details from "@/app/assets/details.json";
import { JSDOM } from "jsdom";
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
    // Use Puppeteer to bypass bot detection
    // Wait for the main content wrapper to load
    const text = await browserManager.fetchText(
      `https://www.researchgate.net/profile/${researchgateId}`,
      ".nova-legacy-o-stack"
    );
    const dom = new JSDOM(text);
    const xmlDoc = dom.window.document;

    const parent = xmlDoc.getElementsByClassName(
      "nova-legacy-o-stack nova-legacy-o-stack--gutter-xxl nova-legacy-o-stack--spacing-xl nova-legacy-o-stack--show-divider"
    );

    if (parent.length === 0) {
      const mainWrapper = xmlDoc.getElementsByClassName("main-wrapper")[0];
      console.warn(
        "Unexpected response from ResearchGate. Could not find publication list."
      );
      if (mainWrapper) {
        console.warn("Main wrapper found, but no publications container.");
        // Check if we're being blocked
        const bodyText = xmlDoc.body?.textContent || "";
        if (
          bodyText.includes("robot") ||
          bodyText.includes("captcha") ||
          bodyText.includes("verify")
        ) {
          console.error(
            "ResearchGate appears to be showing a bot detection page."
          );
        }
      }
      return [];
    }

    const children = parent[0].getElementsByClassName(
      "nova-legacy-o-stack__item"
    );

    return Array.from(children)
      .map((child) => {
        const linkElements = child.getElementsByClassName("nova-legacy-e-link");
        if (linkElements.length === 0) {
          console.warn("No link found in publication item, skipping...");
          return null;
        }

        const link = linkElements[0];
        const title = link.textContent || "";
        const source = link.getAttribute("href") || "";

        const descriptionElements = child.getElementsByClassName(
          "nova-legacy-v-publication-item__description"
        );
        const description =
          descriptionElements.length > 0
            ? descriptionElements[0].textContent || ""
            : "";

        const metaDataElements = child.getElementsByClassName(
          "nova-legacy-v-publication-item__meta-data-item"
        );
        const createdAt =
          metaDataElements.length > 0
            ? new Date(metaDataElements[0].textContent || "").toISOString()
            : new Date().toISOString();

        const badgeElements = child.getElementsByClassName(
          "nova-legacy-e-badge"
        );
        const type =
          badgeElements.length > 0 ? badgeElements[0].textContent || "" : "";

        return {
          title,
          description,
          source,
          createdAt,
          type,
          platform: "researchgate",
        } as FeaturedProject & { type?: string };
      })
      .filter(
        (item): item is FeaturedProject & { type?: string } => item !== null
      )
      .filter((item) => item.type !== "Presentation")
      .map((item) => {
        const { type, ...project } = item;
        return project;
      });
  } finally {
    await closeBrowser();
  }
};

const filePath = path.join(__dirname, "response.json");
loader().then((projects) => freeze(projects, filePath, "ResearchGate"));
