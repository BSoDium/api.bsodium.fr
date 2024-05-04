import frozenResponse from "./response.json";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET(request: Request) {
  if (frozenResponse.length === 0) {
    console.warn("Frozen response is empty");
    return new Response("[]" as any, {
      status: 404,
      statusText: "Not found",
    });
  }
  return new Response(JSON.stringify(frozenResponse));
}
