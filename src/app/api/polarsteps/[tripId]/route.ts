import { NextResponse } from "next/server";
import { getTrip } from "../client";
import { StepResponse, TripDetailResponse } from "../Types";

export const revalidate = 86400; // 24 hours ISR

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;
    const trip = await getTrip(tripId);

    const steps: StepResponse[] = (trip.all_steps ?? []).map((step) => ({
      id: step.id,
      name: step.name,
      description: step.description,
      startTime: step.start_time
        ? new Date(step.start_time * 1000).toISOString()
        : undefined,
      location: step.location
        ? {
            lat: step.location.lat,
            lon: step.location.lon,
            name: step.location.name,
            countryCode: step.location.country_code,
          }
        : undefined,
      weather:
        step.weather_condition || step.weather_temperature
          ? {
              condition: step.weather_condition,
              temperature: step.weather_temperature,
            }
          : undefined,
      mediaCount: step.media_count,
      commentCount: step.comment_count,
    }));

    const response: TripDetailResponse = {
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
      steps,
      likes: trip.likes,
      views: trip.views,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("401") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
