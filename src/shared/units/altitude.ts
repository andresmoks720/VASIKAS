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

const formatNumber = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(1));

export const feetToMeters = (feet: number) => feet * METERS_PER_FOOT;

export const metersToFeet = (meters: number) => meters / METERS_PER_FOOT;

export function formatAltitude(
  altitude: Altitude,
  opts: {
    showFeet?: boolean;
  } = {},
) {
  const showFeet = opts.showFeet ?? false;
  const meters = altitude.meters;
  const metersText = meters == null ? "—" : `${formatNumber(meters)}`;
  const feetText = meters == null ? "—" : `${Math.round(metersToFeet(meters))}`;

  const numeric = meters == null ? "—" : showFeet ? `${metersText} m (${feetText} ft)` : `${metersText} m`;

  const refSource = `${altitude.ref} (${altitude.source})`;
  const comment = altitude.comment && altitude.comment.trim().length > 0 ? altitude.comment : "from upstream";

  const parts = [numeric, refSource, comment];

  if (meters == null && altitude.rawText) {
    parts.push(`raw: ${altitude.rawText}`);
  }

  return parts.join(" — ");
}
