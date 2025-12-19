const METERS_PER_FOOT = 0.3048;

export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;
  ref: AltitudeRef;
  source: AltitudeSource;
  comment?: string;
  rawText?: string;
};

const formatNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(1);

export const ftToM = (feet: number) => feet * METERS_PER_FOOT;

export const mToFt = (meters: number) => meters / METERS_PER_FOOT;

export const formatAltitude = (altitude: Altitude) => {
  const { meters, ref, source, comment } = altitude;

  const base =
    meters == null
      ? "Unknown altitude"
      : `${formatNumber(meters)} m (${Math.round(mToFt(meters))} ft)`;

  const withMetadata = `${base} — ${ref} (${source})`;

  if (!comment) {
    return withMetadata;
  }

  return `${withMetadata} — ${comment}`;
};
