import type { TimeInfo, TimeQuality, TimeWindow } from "./types";

export type TimeUnrollInput = {
  validFrom?: string;
  validUntil?: string;
  scheduleText?: string;
  generatedAt: string;
  lookaheadDays: number;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }
  return parsed;
}

function toIso(date: Date): string {
  return date.toISOString();
}

function clampWindow(start: Date, end: Date, min: Date, max: Date): TimeWindow | null {
  const clampedStart = start > min ? start : min;
  const clampedEnd = end < max ? end : max;
  if (clampedEnd <= clampedStart) {
    return null;
  }
  return { start: toIso(clampedStart), end: toIso(clampedEnd) };
}

function isSrSsPlaceholder(text: string | undefined): boolean {
  if (!text) {
    return false;
  }
  return /\bSR\b|\bSS\b/i.test(text);
}

function buildPlaceholderWindows(startDate: Date, endDate: Date): TimeWindow[] {
  const windows: TimeWindow[] = [];
  const startDay = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const endDay = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

  for (let cursor = startDay; cursor <= endDay; cursor = new Date(cursor.getTime() + MS_PER_DAY)) {
    const windowStart = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 7, 0, 0));
    const windowEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), 18, 0, 0));
    windows.push({
      start: toIso(windowStart),
      end: toIso(windowEnd),
      comment: "SR/SS placeholder applied",
    });
  }

  return windows;
}

export function unrollTime(input: TimeUnrollInput): TimeInfo {
  const generatedAtDate = new Date(input.generatedAt);
  const lookaheadEnd = new Date(generatedAtDate.getTime() + input.lookaheadDays * MS_PER_DAY);

  const fallbackStart = generatedAtDate;
  const fallbackEnd = lookaheadEnd;

  const validFromDate = parseDate(input.validFrom, fallbackStart);
  const validUntilDate = parseDate(input.validUntil, fallbackEnd);

  const validFrom = toIso(validFromDate);
  const validUntil = toIso(validUntilDate);

  const scheduleText = input.scheduleText;

  let quality: TimeQuality = "EXACT";
  let original: Record<string, unknown> | undefined;
  let activations: TimeWindow[] = [];

  if (isSrSsPlaceholder(scheduleText)) {
    quality = "PLACEHOLDER";
    original = {
      rawText: scheduleText,
      srSsPolicy: "PLACEHOLDER_0700_1800",
    };

    const placeholderWindows = buildPlaceholderWindows(validFromDate, validUntilDate);
    activations = placeholderWindows
      .map(window => {
        const start = new Date(window.start);
        const end = new Date(window.end);
        return clampWindow(start, end, generatedAtDate, lookaheadEnd);
      })
      .filter((window): window is TimeWindow => window !== null)
      .map(window => ({ ...window, comment: "SR/SS placeholder applied" }));
  } else if (input.validFrom && input.validUntil) {
    const window = clampWindow(validFromDate, validUntilDate, generatedAtDate, lookaheadEnd);
    activations = window ? [window] : [];
  } else {
    quality = "UNKNOWN";
    original = scheduleText ? { rawText: scheduleText } : undefined;
    const window = clampWindow(validFromDate, validUntilDate, generatedAtDate, lookaheadEnd);
    activations = window ? [window] : [];
  }

  if (activations.length === 0) {
    activations = [{ start: validFrom, end: validUntil }];
    if (quality === "EXACT" && !(input.validFrom && input.validUntil)) {
      quality = "UNKNOWN";
    }
  }

  return {
    validFrom,
    validUntil,
    activations,
    quality,
    ...(original ? { original } : {}),
  };
}
