import { JSDOM } from "jsdom";
import { FeaturedProject } from "../Types";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

const researchgateId = "Elliot-Negrel-Jerzy";

export async function GET(request: Request) {
  const text = await fetch(
    `https://www.researchgate.net/profile/${researchgateId}`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-GB,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        priority: "u=0, i",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "same-origin",
        "sec-fetch-site": "same-origin",
        "upgrade-insecure-requests": "1",
        "x-entry-page": "",
        "x-rg-referrer": "",
      },
      referrer: "https://www.researchgate.net/profile/lite.worker.js",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  ).then((response) => response.text());
  const dom = new JSDOM(text);
  const xmlDoc = dom.window.document;

  const parent = xmlDoc.getElementsByClassName(
    "nova-legacy-o-stack nova-legacy-o-stack--gutter-xxl nova-legacy-o-stack--spacing-xl nova-legacy-o-stack--show-divider"
  );

  if (parent.length === 0) {
    console.warn(
      "Unexpected response from ResearchGate: ",
      xmlDoc.getElementsByClassName("main-wrapper")[0].innerHTML
    );
    return new Response("[]" as any, {
      status: 429,
      statusText: "Rate limit exceeded",
    });
  }

  const children = parent[0].getElementsByClassName(
    "nova-legacy-o-stack__item"
  );

  const items: FeaturedProject[] = Array.from(children)
    .map((child) => {
      const link = child.getElementsByClassName("nova-legacy-e-link")[0];

      const title = link.textContent || "";
      const source = link.getAttribute("href") || "";

      const description =
        child.getElementsByClassName(
          "nova-legacy-v-publication-item__description"
        )[0].textContent || "";

      const createdAt = new Date(
        child.getElementsByClassName(
          "nova-legacy-v-publication-item__meta-data-item"
        )[0].textContent || ""
      ).toISOString();

      const type =
        child.getElementsByClassName("nova-legacy-e-badge")[0].textContent ||
        "";

      return {
        title,
        description,
        source,
        createdAt,
        type,
        platform: "researchgate",
      } as FeaturedProject & { type?: string };
    })
    .filter((item) => item.type !== "Presentation")
    .map((item) => {
      delete item.type;
      return item;
    });

  return new Response(JSON.stringify(items));
}
