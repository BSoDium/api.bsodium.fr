import details from "@/app/assets/details.json";
import { NextResponse } from "next/server";
import { getTrip, getUserByUsername } from "../client";
import { PolarstepsStep, StepResponse } from "../Types";

export const revalidate = 86400; // 24 hours ISR

const DEFAULT_MAX_PER_COUNTRY = 3;

function transformStep(
  step: PolarstepsStep,
  tripName: string,
): StepResponse & { tripName: string } {
  return {
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
    tripName,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxPerCountry = parseInt(
      searchParams.get("maxPerCountry") ?? String(DEFAULT_MAX_PER_COUNTRY),
      10,
    );
    const namedOnly = searchParams.get("namedOnly") !== "false";

    const user = await getUserByUsername(details.polarsteps.username);
    const trips = (user.alltrips ?? []).filter((t) => !t.is_deleted);

    // Fetch all trips in parallel
    const tripDetails = await Promise.all(
      trips.map((t) => getTrip(String(t.id))),
    );

    // Collect all named steps across all trips
    const allSteps: (StepResponse & { tripName: string })[] = [];
    for (const trip of tripDetails) {
      const steps = trip.all_steps ?? [];
      const filtered = namedOnly
        ? steps.filter((s) => "name" in s && "description" in s)
        : steps;

      for (const step of filtered) {
        if (!step.location) continue; // skip steps without a location
        allSteps.push(
          transformStep(step, trip.name?.trim() ?? "Untitled Trip"),
        );
      }
    }

    // Cap steps per country code
    const countPerCountry = new Map<string, number>();
    const capped = allSteps.filter((step) => {
      const code = step.location?.countryCode ?? "unknown";
      const count = countPerCountry.get(code) ?? 0;
      if (count >= maxPerCountry) return false;
      countPerCountry.set(code, count + 1);
      return true;
    });

    return NextResponse.json(capped);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("401") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
