import { put, list, del } from "@vercel/blob";
import { FeaturedProjects } from "./Types";

const BLOB_PREFIX = "featured";

function blobPath(platform: string): string {
  return `${BLOB_PREFIX}/${platform}.json`;
}

export async function getCachedProjects(
  platform: string,
): Promise<FeaturedProjects> {
  const { blobs } = await list({ prefix: blobPath(platform) });
  if (blobs.length === 0) return [];

  const res = await fetch(blobs[0].url);
  if (!res.ok) return [];

  return res.json();
}

export async function setCachedProjects(
  platform: string,
  data: FeaturedProjects,
): Promise<void> {
  // Delete old blob(s) with this prefix
  const { blobs } = await list({ prefix: blobPath(platform) });
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url));
  }

  await put(blobPath(platform), JSON.stringify(data), {
    contentType: "application/json",
    access: "public",
  });
}
