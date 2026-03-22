import { PolarstepsTrip, PolarstepsUser } from "./Types";

const BASE_URL = "https://api.polarsteps.com";

function getRememberToken(): string {
  const token = process.env.POLARSTEPS_REMEMBER_TOKEN;
  if (!token) {
    throw new Error(
      "POLARSTEPS_REMEMBER_TOKEN environment variable is not set",
    );
  }
  return token;
}

function getHeaders(): HeadersInit {
  return {
    "User-Agent": "PolarstepsClient/1.0",
    Accept: "application/json",
    "Content-Type": "application/json",
    Cookie: `remember_token=${getRememberToken()}`,
  };
}

export async function getUserByUsername(
  username: string,
): Promise<PolarstepsUser> {
  const res = await fetch(
    `${BASE_URL}/users/byusername/${encodeURIComponent(username)}`,
    {
      headers: getHeaders(),
      next: { revalidate: 86400 },
    },
  );

  if (!res.ok) {
    throw new Error(`Polarsteps API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function getTrip(tripId: string): Promise<PolarstepsTrip> {
  const res = await fetch(`${BASE_URL}/trips/${encodeURIComponent(tripId)}`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Polarsteps API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
