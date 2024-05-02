import { JSDOM } from 'jsdom';
import { FeaturedProject } from '../Types';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
  const text = await fetch("https://www.researchgate.net/profile/Elliot-Negrel-Jerzy", {
    "headers": {
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then((response) => response.text());
  const dom = new JSDOM(text);
  const xmlDoc = dom.window.document;

  console.log(text)

  const parent = xmlDoc.getElementsByClassName("nova-legacy-o-stack nova-legacy-o-stack--gutter-xxl nova-legacy-o-stack--spacing-xl nova-legacy-o-stack--show-divider");

  const children = parent[0].getElementsByClassName("nova-legacy-o-stack__item");

  const items: FeaturedProject[] = Array.from(children).map((child) => {
    const link = child.getElementsByClassName("nova-legacy-e-link")[0];
    
    const title = link.textContent || "";
    const source = link.getAttribute("href") || "";

    const description = child.getElementsByClassName("nova-legacy-v-publication-item__description")[0].textContent || "";

    const createdAt = new Date(child.getElementsByClassName("nova-legacy-v-publication-item__meta-data-item")[0].textContent || "").toISOString();
    
    const type = child.getElementsByClassName("nova-legacy-e-badge")[0].textContent || "";
    
    return { title, description, source, createdAt, platform: 'researchgate' };
  }
  );
  
  return new Response(JSON.stringify(items));
}