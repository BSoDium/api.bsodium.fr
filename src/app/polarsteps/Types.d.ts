export interface PolarstepsLocation {
  lat: number;
  lon: number;
  name?: string;
  detail?: string;
  country_code?: string;
}

export interface PolarstepsCoverPhoto {
  id: number;
  path?: string;
  small_thumbnail_path?: string;
  large_thumbnail_path?: string;
}

export interface PolarstepsStep {
  id: number;
  uuid: string;
  name?: string;
  slug?: string;
  description?: string;
  start_time?: number;
  location?: PolarstepsLocation;
  weather_condition?: string;
  weather_temperature?: number;
  media_count?: number;
  comment_count?: number;
  cover_photo?: PolarstepsCoverPhoto;
}

export interface PolarstepsTripSummary {
  id: number;
  uuid: string;
  name?: string;
  slug?: string;
  summary?: string;
  start_date?: number;
  end_date?: number;
  total_km?: number;
  cover_photo?: PolarstepsCoverPhoto;
  country_codes?: string[];
  is_deleted?: boolean;
}

export interface PolarstepsTrip extends PolarstepsTripSummary {
  all_steps?: PolarstepsStep[];
  likes?: number;
  views?: number;
}

export interface PolarstepsStats {
  country_count?: number;
  km_count?: number | string;
  trip_count?: number;
  step_count?: number;
}

export interface PolarstepsUser {
  id: number;
  uuid: string;
  username: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  profile_image_path?: string;
  country_count?: number;
  stats?: PolarstepsStats;
  alltrips?: PolarstepsTripSummary[];
}

/**
 * Transformed trip summary for the public API response
 */
export interface TripSummaryResponse {
  id: number;
  name: string;
  slug?: string;
  summary?: string;
  startDate?: string;
  endDate?: string;
  totalKm?: number;
  coverPhoto?: string;
  countryCodes?: string[];
}

/**
 * Transformed step for the public API response
 */
export interface StepResponse {
  id: number;
  name?: string;
  description?: string;
  startTime?: string;
  location?: {
    lat: number;
    lon: number;
    name?: string;
    countryCode?: string;
  };
  weather?: {
    condition?: string;
    temperature?: number;
  };
  mediaCount?: number;
  commentCount?: number;
}

/**
 * An edge connecting two consecutive steps within a trip
 */
export interface EdgeResponse {
  from: { stepId: number; lat: number; lon: number };
  to: { stepId: number; lat: number; lon: number };
  type: "flight" | "ground";
  distanceKm: number;
}

/**
 * Full trip detail for the public API response
 */
export interface TripDetailResponse extends TripSummaryResponse {
  steps: StepResponse[];
  edges: EdgeResponse[];
  likes?: number;
  views?: number;
}
