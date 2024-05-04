import { FeaturedProjects } from "../Types";
import { FrozenResponse } from "../utils";
import json from "./response.json";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET() {
  return new FrozenResponse(json as FeaturedProjects);
}
