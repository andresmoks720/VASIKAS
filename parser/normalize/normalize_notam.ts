import { normalizeNotamItem } from "@parser/notam/notamNormalizer";
import type { NormalizedNotam, NotamGeometry } from "@parser/notam/notamTypes";
import type { InternalFeature, RestrictionProperties } from "./types";
import { parseVerticalLimitsFromRange } from "./units";
import { unrollTime } from "./time_unroll";

export type NormalizeNotamOptions = {
  generatedAt: string;
  lookaheadDays: number;
  rounding: { altitude_m: number };
};

const CIRCLE_TAG = "CIRCLE";
const FORCE_KEEP_PATTERN = /\b(UAS|UAV|DRONE|RPAS|MODEL FLYING|GNSS|GPS|JAMMING|INTERFERENCE)\b/i;
const FORCE_DROP_PATTERN = /\b(FUEL|AVGAS|JET A1|RWY|APRON|TAXIWAY|ILS|LOC|STAR|SID)\b/i;

type DropReason = "SUBJECT_DENYLIST" | "SUBJECT_UNKNOWN" | "AERODROME_SCOPE" | "KEYWORD_FORCE_DROP";

const KEEP_SUBJECTS = new Set(["RA", "RD", "RP", "RR", "RT", "WM", "WP", "WU", "WZ", "OB"]);
const AERODROME_ALLOWLIST = new Set(["OB"]);
const STRATEGIC_RADIUS_THRESHOLD_NM = 300;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const value = obj[key];
  return isString(value) ? value : undefined;
}

function getItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (isObject(payload)) {
    const candidates = ["items", "notams", "data"];
    for (const key of candidates) {
      const value = payload[key];
      if (Array.isArray(value)) {
        return value;
      }
    }
  }
  return [];
}

function extractSubjectScope(item: Record<string, unknown>): { subject?: string; scope?: string } {
  if (!isObject(item.qualifiers)) {
    return {};
  }
  const qualifiers = item.qualifiers as Record<string, unknown>;
  const subject = getString(qualifiers, "subject")?.toUpperCase();
  const scope = getString(qualifiers, "scope")?.toUpperCase();
  if (subject) {
    return { subject, scope };
  }
  const qCodeCandidate = getString(qualifiers, "qCode")
    ?? getString(qualifiers, "qcode")
    ?? getString(item, "qCode")
    ?? getString(item, "qcode");
  if (!qCodeCandidate) {
    return { subject, scope };
  }
  const match = qCodeCandidate.toUpperCase().match(/Q([A-Z]{2})/);
  return { subject: match?.[1], scope };
}

function getQualifierCircle(item: Record<string, unknown>): { coordinate?: string; radius?: number } {
  if (!isObject(item.qualifiers)) {
    return {};
  }
  const qualifiers = item.qualifiers as Record<string, unknown>;
  const coordinate = getString(qualifiers, "coordinate");
  const radiusValue = qualifiers["radius"];
  const radius = typeof radiusValue === "number" ? radiusValue : undefined;
  return { coordinate, radius };
}

function isStrategicRadius(radius: number | undefined): boolean {
  if (radius === undefined) {
    return false;
  }
  return radius === 999 || radius >= STRATEGIC_RADIUS_THRESHOLD_NM;
}

function getEventTime(payload: unknown): string {
  if (isObject(payload)) {
    const generated = getString(payload, "generatedAtUtc") ?? getString(payload, "generatedAt");
    if (generated) {
      return generated;
    }
  }
  return new Date().toISOString();
}

function extractScheduleText(item: Record<string, unknown>): string | undefined {
  const candidates = ["schedule", "scheduleText", "time", "times", "period"];
  for (const key of candidates) {
    const value = item[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return undefined;
}

function parseSupersedes(item: Record<string, unknown>): string[] {
  const candidates = ["replaces", "replaced", "supersedes", "superseded"];
  for (const key of candidates) {
    const value = item[key];
    if (typeof value === "string") {
      return [value];
    }
    if (Array.isArray(value)) {
      return value.filter((entry): entry is string => typeof entry === "string");
    }
    if (isObject(value)) {
      const id = getString(value, "id");
      if (id) {
        return [id];
      }
    }
  }
  return [];
}

function evaluateRelevance(
  subject: string | undefined,
  scope: string | undefined,
  text: string,
): { keep: boolean; reason?: DropReason } {
  if (scope === "A" && (!subject || !AERODROME_ALLOWLIST.has(subject))) {
    return { keep: false, reason: "AERODROME_SCOPE" };
  }

  if (subject && KEEP_SUBJECTS.has(subject)) {
    return { keep: true };
  }

  if (FORCE_KEEP_PATTERN.test(text)) {
    return { keep: true };
  }

  if (FORCE_DROP_PATTERN.test(text)) {
    return { keep: false, reason: "KEYWORD_FORCE_DROP" };
  }

  if (!subject) {
    return { keep: false, reason: "SUBJECT_UNKNOWN" };
  }

  return { keep: false, reason: "SUBJECT_DENYLIST" };
}

function extractRelatedTo(text: string): string | null {
  const match = text.match(/\b((?:EER|EED|EEP|TSA|TRA|CBA)\s*[A-Z0-9/-]+)\b/i);
  if (!match) {
    return null;
  }
  return match[1]!.replace(/\s+/g, "");
}

function classifyNotam(text: string): Pick<RestrictionProperties, "category" | "restriction" | "priority" | "tags"> {
  const normalized = text.toUpperCase();
  const tags: string[] = ["NOTAM"];

  let category: RestrictionProperties["category"] = "AIRSPACE";
  if (/OBST|CRANE|MAST/.test(normalized)) {
    category = "OBSTACLE";
    tags.push("OBSTACLE");
  } else if (/PROC/.test(normalized)) {
    category = "PROCEDURE";
    tags.push("PROCEDURE");
  }

  let restriction: RestrictionProperties["restriction"] = "INFORMATION";
  if (/PROHIBITED|PROH\b/.test(normalized)) {
    restriction = "PROHIBITED";
  } else if (/DANGER|DNG/.test(normalized)) {
    restriction = "DANGER";
  } else if (/RESTRICTED|RSTR/.test(normalized)) {
    restriction = "RESTRICTED";
  } else if (/AUTH|AUTHORISATION/.test(normalized)) {
    restriction = "REQ_AUTHORISATION";
  } else if (/WARN|WARNING|OBST/.test(normalized)) {
    restriction = "WARNING";
  }

  let priority: RestrictionProperties["priority"] = "LOW";
  if (restriction === "PROHIBITED" || restriction === "DANGER") {
    priority = "HIGH";
  } else if (restriction === "RESTRICTED") {
    priority = "HIGH";
  } else if (restriction === "REQ_AUTHORISATION") {
    priority = "MEDIUM";
  }

  tags.push(restriction);
  if (category !== "AIRSPACE") {
    tags.push(category);
  }

  return { category, restriction, priority, tags };
}

function geometryToFeature(
  geometry: NotamGeometry,
  options?: { suppressCircleShape?: boolean; includeStrategicTag?: boolean },
) {
  if (!geometry) {
    return null;
  }
  if (geometry.kind === "circle") {
    const suppressCircleShape = options?.suppressCircleShape ?? false;
    const tags: string[] = [];
    if (!suppressCircleShape) {
      tags.push(CIRCLE_TAG);
    }
    if (options?.includeStrategicTag) {
      tags.push("STRATEGIC_NOTICE");
    }
    return {
      geometry: { type: "Point" as const, coordinates: geometry.center },
      ...(suppressCircleShape ? {} : { shape: { type: "CIRCLE" as const, radius_m: geometry.radiusMeters } }),
      tags,
    };
  }
  if (geometry.kind === "polygon") {
    return {
      geometry: { type: "Polygon" as const, coordinates: geometry.rings },
      tags: [],
    };
  }
  return {
    geometry: { type: "MultiPolygon" as const, coordinates: geometry.polygons },
    tags: [],
  };
}

function computeBBoxAndLabel(geometry: NotamGeometry): { bbox?: [number, number, number, number]; labelPoint?: [number, number] } {
  if (!geometry || geometry.kind === "circle") {
    return { labelPoint: geometry && geometry.kind === "circle" ? geometry.center : undefined };
  }

  const points: [number, number][] = [];
  const collect = (coords: [number, number][][]) => {
    for (const ring of coords) {
      for (const point of ring) {
        points.push(point);
      }
    }
  };

  if (geometry.kind === "polygon") {
    collect(geometry.rings);
  } else if (geometry.kind === "multiPolygon") {
    for (const polygon of geometry.polygons) {
      collect(polygon);
    }
  }

  if (points.length === 0) {
    return {};
  }

  let minLon = points[0]![0];
  let minLat = points[0]![1];
  let maxLon = points[0]![0];
  let maxLat = points[0]![1];

  for (const [lon, lat] of points) {
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  }

  return {
    bbox: [minLon, minLat, maxLon, maxLat],
    labelPoint: [(minLon + maxLon) / 2, (minLat + maxLat) / 2],
  };
}

function buildFeatureId(notam: NormalizedNotam, activationStart: string): string {
  const safeId = notam.id.replace(/\s+/g, "");
  return `eff:NOTAM:${safeId}:${activationStart}`;
}

export function normalizeNotamPayload(
  payload: unknown,
  options: NormalizeNotamOptions,
): {
  features: InternalFeature[];
  droppedNoGeometry: number;
  droppedNotRelevant: { total: number; reasons: Record<DropReason, number> };
} {
  const items = getItems(payload);
  const eventTimeUtc = getEventTime(payload);
  let droppedNoGeometry = 0;
  const droppedNotRelevant = {
    total: 0,
    reasons: {
      SUBJECT_DENYLIST: 0,
      SUBJECT_UNKNOWN: 0,
      AERODROME_SCOPE: 0,
      KEYWORD_FORCE_DROP: 0,
    },
  } satisfies { total: number; reasons: Record<DropReason, number> };

  const features: InternalFeature[] = [];

  for (const item of items) {
    if (!isObject(item)) {
      continue;
    }

    const normalized = normalizeNotamItem(item, eventTimeUtc);
    if (!normalized || !normalized.geometry) {
      droppedNoGeometry += 1;
      continue;
    }

    const scheduleText = extractScheduleText(item);
    const timeInfo = unrollTime({
      validFrom: normalized.validFromUtc,
      validUntil: normalized.validToUtc,
      scheduleText,
      generatedAt: options.generatedAt,
      lookaheadDays: options.lookaheadDays,
    });

    const { subject, scope } = extractSubjectScope(item);
    const relevance = evaluateRelevance(subject, scope, normalized.text);
    if (!relevance.keep) {
      droppedNotRelevant.total += 1;
      if (relevance.reason) {
        droppedNotRelevant.reasons[relevance.reason] += 1;
      }
      continue;
    }

    const qualifierCircle = getQualifierCircle(item);
    const suppressCircleShape = normalized.geometry.kind === "circle" && isStrategicRadius(qualifierCircle.radius);

    const vertical = parseVerticalLimitsFromRange(normalized.text, options.rounding);
    const classification = classifyNotam(normalized.text);
    const geometryInfo = geometryToFeature(normalized.geometry, {
      suppressCircleShape,
      includeStrategicTag: suppressCircleShape,
    });
    if (!geometryInfo) {
      droppedNoGeometry += 1;
      continue;
    }

    const relatedTo = extractRelatedTo(normalized.text);
    const supersedes = parseSupersedes(item);
    const linkRelation = supersedes.length > 0 ? "REPLACEMENT" : "NEW";

    const tags = [...classification.tags, ...geometryInfo.tags];
    if (timeInfo.quality === "PLACEHOLDER") {
      tags.push("SRSS_PLACEHOLDER");
    }

    const displayTitle = normalized.id;

    const { bbox, labelPoint } = computeBBoxAndLabel(normalized.geometry);

    const featureId = buildFeatureId(normalized, timeInfo.activations[0]!.start);

    features.push({
      feature: {
        type: "Feature",
        id: featureId,
        geometry: geometryInfo.geometry,
        properties: {
          category: classification.category,
          restriction: classification.restriction,
          priority: classification.priority,
          tags,
          ...("shape" in geometryInfo && geometryInfo.shape ? { shape: geometryInfo.shape } : {}),
          vertical,
          time: timeInfo,
          link: {
            relationType: linkRelation,
            relatedTo,
            supersedes,
          },
          provenance: {
            inputs: [
              { source: "NOTAM", id: normalized.id },
              ...supersedes.map(id => ({ source: "NOTAM" as const, id })),
            ],
          },
          display: {
            title: displayTitle,
            summary: normalized.summary,
            content: normalized.text,
          },
          ...(labelPoint ? { labelPoint } : {}),
          ...(bbox ? { bbox } : {}),
        },
      },
      sourceId: normalized.id,
      supersedes,
    });
  }

  return { features, droppedNoGeometry, droppedNotRelevant };
}
