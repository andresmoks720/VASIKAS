const UNKNOWN_TIME_TEXT = "Unknown time";

export function formatUtcTimestamp(value: string | null | undefined): string {
  if (!value) {
    return UNKNOWN_TIME_TEXT;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid time";
  }

  const isoString = date.toISOString();

  return isoString.endsWith(".000Z")
    ? isoString.replace(".000Z", "Z")
    : isoString;
}
