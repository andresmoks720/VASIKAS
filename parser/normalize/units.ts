import type { VerticalLimits, VerticalRef } from "./types";

const FT_TO_METERS = 0.3048;

export type RoundingConfig = {
  altitude_m: number;
};

export function roundMeters(value: number, step: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (step <= 0) {
    return value;
  }
  return Math.round(value / step) * step;
}

export function feetToMeters(feet: number): number {
  return feet * FT_TO_METERS;
}

export function flightLevelToMeters(fl: number): number {
  return feetToMeters(fl * 100);
}

const NBSP = /\u00a0/g;

function normalizeText(value: string): string {
  return value.replace(NBSP, " ").replace(/\s+/g, " ").trim().toUpperCase();
}

function parseFeet(value: string): number | null {
  const match = value.match(/(\d+(?:\.\d+)?)\s*FT/);
  if (!match) {
    return null;
  }
  return Number.parseFloat(match[1]);
}

function parseMeters(value: string): number | null {
  const match = value.match(/(\d+(?:\.\d+)?)\s*M/);
  if (!match) {
    return null;
  }
  return Number.parseFloat(match[1]);
}

function parseFlightLevel(value: string): number | null {
  const match = value.match(/\bFL\s*(\d+)\b/);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

export type ParsedAltitude = {
  meters: number | null;
  ref: VerticalRef;
  original: string;
};

export function parseSingleAltitude(raw: string): ParsedAltitude {
  const normalized = normalizeText(raw);
  if (normalized.includes("SFC") || normalized.includes("GND")) {
    return { meters: 0, ref: "SFC", original: raw };
  }

  const fl = parseFlightLevel(normalized);
  if (fl !== null) {
    return { meters: flightLevelToMeters(fl), ref: "STD", original: raw };
  }

  const feet = parseFeet(normalized);
  if (feet !== null) {
    const ref = normalized.includes("AGL") ? "AGL" : "AMSL";
    return { meters: feetToMeters(feet), ref, original: raw };
  }

  const meters = parseMeters(normalized);
  if (meters !== null) {
    const ref = normalized.includes("AGL") ? "AGL" : "AMSL";
    return { meters, ref, original: raw };
  }

  return { meters: null, ref: "UNKNOWN", original: raw };
}

export function parseVerticalLimitsFromRange(text: string, rounding: RoundingConfig): VerticalLimits {
  const normalized = normalizeText(text);
  const rangeMatch = normalized.match(/(.+?)\s*(?:TO|-|–)\s*(.+)/);
  if (rangeMatch) {
    const lower = parseSingleAltitude(rangeMatch[1]);
    const upper = parseSingleAltitude(rangeMatch[2]);
    return normalizeVerticalLimits(lower, upper, rounding, { rawText: text });
  }

  const single = parseSingleAltitude(text);
  if (single.meters !== null) {
    const lower = { meters: 0, ref: "SFC" as const, original: "SFC" };
    return normalizeVerticalLimits(lower, single, rounding, { rawText: text });
  }

  return normalizeVerticalLimits(
    { meters: 0, ref: "SFC", original: "SFC" },
    { meters: null, ref: "UNKNOWN", original: text },
    rounding,
    { rawText: text },
  );
}

export function parseVerticalLimitsFromSeparate(
  lowerText: string | undefined,
  upperText: string | undefined,
  rounding: RoundingConfig,
): VerticalLimits {
  if (!lowerText && !upperText) {
    return normalizeVerticalLimits(
      { meters: 0, ref: "SFC", original: "SFC" },
      { meters: null, ref: "UNKNOWN", original: "" },
      rounding,
      { rawText: "" },
    );
  }

  if (lowerText && upperText) {
    const lower = parseSingleAltitude(lowerText);
    const upper = parseSingleAltitude(upperText);
    return normalizeVerticalLimits(lower, upper, rounding, { lower: lowerText, upper: upperText });
  }

  const upper = upperText ?? lowerText ?? "";
  return parseVerticalLimitsFromRange(upper, rounding);
}

function normalizeVerticalLimits(
  lower: ParsedAltitude,
  upper: ParsedAltitude,
  rounding: RoundingConfig,
  original: Record<string, unknown>,
): VerticalLimits {
  const lowerMeters = lower.meters ?? 0;
  const roundedLower = Math.max(0, roundMeters(lowerMeters, rounding.altitude_m));
  const upperMeters = upper.meters;
  const roundedUpper = upperMeters === null ? null : Math.max(0, roundMeters(upperMeters, rounding.altitude_m));

  const safeUpper = roundedUpper !== null && roundedUpper < roundedLower ? roundedLower : roundedUpper;

  return {
    lower_m: roundedLower,
    upper_m: safeUpper,
    lower_ref: lower.ref,
    upper_ref: upper.ref,
    original,
  };
}
