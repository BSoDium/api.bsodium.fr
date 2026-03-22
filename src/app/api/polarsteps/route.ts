import details from "@/app/assets/details.json";
import { NextResponse } from "next/server";
import { getUserByUsername } from "./client";
import { TripSummaryResponse } from "./Types";

export const revalidate = 86400; // 24 hours ISR

export async function GET() {
  try {
    const user = await getUserByUsername(details.polarsteps.username);

    const trips: TripSummaryResponse[] = (user.alltrips ?? [])
      .filter((t) => !t.is_deleted)
      .map((trip) => ({
        id: trip.id,
        name: trip.name?.trim() ?? "Untitled Trip",
        slug: trip.slug,
        summary: trip.summary,
        startDate: trip.start_date
          ? new Date(trip.start_date * 1000).toISOString()
          : undefined,
        endDate: trip.end_date
          ? new Date(trip.end_date * 1000).toISOString()
          : undefined,
        totalKm: trip.total_km,
        coverPhoto:
          trip.cover_photo?.large_thumbnail_path ?? trip.cover_photo?.path,
        countryCodes: trip.country_codes,
      }));

    return NextResponse.json(trips);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("401") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
