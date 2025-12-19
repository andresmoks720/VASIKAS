export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;
  ref: AltitudeRef;
  source: AltitudeSource;
  comment?: string;
  rawText?: string;
};

export type LonLat = { lon: number; lat: number };
