const UNKNOWN_TIME_TEXT = "Unknown time";
const UTC_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export function formatUtcTimestamp(value: string | null | undefined): string {
  if (!value) {
    return UNKNOWN_TIME_TEXT;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return UNKNOWN_TIME_TEXT;
  }

  if (!UTC_TIMESTAMP_PATTERN.test(trimmedValue)) {
    return "Invalid time";
  }

  const date = new Date(trimmedValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid time";
  }

  const isoString = date.toISOString();

  return isoString.endsWith(".000Z")
    ? isoString.replace(".000Z", "Z")
    : isoString;
}
