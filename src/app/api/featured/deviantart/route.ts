import { JSDOM } from 'jsdom';
import { FeaturedProject } from '../Types';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const deviantartId = 'BSoDium';

export async function GET(request: Request) {
  const text = await fetch(`https://backend.deviantart.com/rss.xml?q=gallery:${deviantartId}`).then((response) => response.text());
  const dom = new JSDOM(text);
  const xmlDoc = dom.window.document;

  const items = xmlDoc.getElementsByTagName("item");
  const projects: FeaturedProject[] = Array.from(items).map((item) => {
    const title = item.getElementsByTagName("title")[0].textContent || "";
    const description = item.getElementsByTagName("media:description")[0].textContent || "";
    const source = item.getElementsByTagName("guid")[0].textContent || "";
    const createdAt = item.getElementsByTagName("pubDate")[0].textContent || "";
    const thumbnails = item.getElementsByTagName("media:thumbnail");
    const thumbnail = thumbnails[thumbnails.length - 1].getAttribute("url") || "";
    
    return { title, source, description, createdAt, thumbnail, platform: 'deviantart'};
  });

  return new Response(JSON.stringify(projects));
}