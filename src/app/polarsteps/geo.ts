import type { EdgeResponse } from "./Types";
import { PolarstepsStep } from "./Types";

const EARTH_RADIUS_KM = 6371;

/** Distance between two lat/lon points in kilometers (Haversine formula). */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FLIGHT_DISTANCE_THRESHOLD_KM = 500;
const FLIGHT_SPEED_THRESHOLD_KMH = 200;

/**
 * Heuristic: classify an edge as flight or ground travel.
 * - Flight if great-circle distance > 500 km
 * - Flight if speed > 200 km/h (when timestamps are available)
 * - Ground otherwise
 */
export function inferTransportType(
  distanceKm: number,
  timeDeltaSeconds: number | null,
): "flight" | "ground" {
  if (distanceKm > FLIGHT_DISTANCE_THRESHOLD_KM) return "flight";

  if (timeDeltaSeconds != null && timeDeltaSeconds > 0) {
    const speedKmh = distanceKm / (timeDeltaSeconds / 3600);
    if (speedKmh > FLIGHT_SPEED_THRESHOLD_KMH) return "flight";
  }

  return "ground";
}

/**
 * Build edges connecting consecutive steps that have location data.
 * Steps are sorted by start_time before computing edges.
 */
export function buildEdges(steps: PolarstepsStep[]): EdgeResponse[] {
  // Filter to steps with location, then sort by start_time
  const located = steps
    .filter(
      (
        s,
      ): s is PolarstepsStep & {
        location: NonNullable<PolarstepsStep["location"]>;
      } => s.location != null,
    )
    .sort((a, b) => {
      const timeA = a.start_time ?? Number.POSITIVE_INFINITY;
      const timeB = b.start_time ?? Number.POSITIVE_INFINITY;
      if (timeA === timeB) {
        // Fallback to stable secondary sort by ID
        return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      }
      return timeA - timeB;
    });

  const edges: EdgeResponse[] = [];

  for (let i = 0; i < located.length - 1; i++) {
    const from = located[i];
    const to = located[i + 1];

    const distanceKm = haversineKm(
      from.location.lat,
      from.location.lon,
      to.location.lat,
      to.location.lon,
    );

    const timeDelta =
      from.start_time != null && to.start_time != null
        ? to.start_time - from.start_time
        : null;

    edges.push({
      from: { stepId: from.id, lat: from.location.lat, lon: from.location.lon },
      to: { stepId: to.id, lat: to.location.lat, lon: to.location.lon },
      type: inferTransportType(distanceKm, timeDelta),
      distanceKm: Math.round(distanceKm),
    });
  }

  return edges;
}
