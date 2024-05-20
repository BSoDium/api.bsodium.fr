import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://www.bsodium.fr", "https://bsodium.fr"];
const isDeploymentOrigin = (origin: string) =>
  origin.startsWith("https://bsodium") && origin.endsWith(".vercel.app");

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = isDev
    ? true
    : allowedOrigins.includes(origin) || isDeploymentOrigin(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
