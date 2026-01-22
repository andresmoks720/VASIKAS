import { promises as fs } from "node:fs";
import path from "node:path";
import type { AirspaceFeature } from "@/services/airspace/airspaceTypes";
import type { InternalFeature, RestrictionProperties } from "./types";
import { parseVerticalLimitsFromSeparate } from "./units";
import { unrollTime } from "./time_unroll";

export type NormalizeAipOptions = {
  dataRoot?: string;
  generatedAt: string;
  lookaheadDays: number;
  rounding: { altitude_m: number };
};

export type NormalizeAipResult = {
  features: InternalFeature[];
  eaipVersion?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
};

function classifyAirspace(properties: AirspaceFeature["properties"]): Pick<RestrictionProperties, "category" | "restriction" | "priority" | "tags"> {
  const designator = properties.designator?.toUpperCase() ?? "";
  const name = properties.name?.toUpperCase() ?? "";
  const remarks = properties.remarks?.toUpperCase() ?? "";
  const text = `${designator} ${name} ${remarks}`;

  let restriction: RestrictionProperties["restriction"] = "INFORMATION";
  if (/PROHIBITED|EER/.test(text)) {
    restriction = "PROHIBITED";
  } else if (/DANGER|EED/.test(text)) {
    restriction = "DANGER";
  } else if (/RESTRICTED|EEP|TRA|TSA/.test(text)) {
    restriction = "RESTRICTED";
  }

  let priority: RestrictionProperties["priority"] = "LOW";
  if (restriction === "PROHIBITED" || restriction === "DANGER") {
    priority = "HIGH";
  } else if (restriction === "RESTRICTED") {
    priority = "MEDIUM";
  }

  const tags = ["EAIP", "PERM", restriction];

  return {
    category: "AIRSPACE",
    restriction,
    priority,
    tags,
  };
}

function computeBBox(coordinates: [number, number][][][]): [number, number, number, number] | null {
  const points: [number, number][] = [];
  for (const polygon of coordinates) {
    for (const ring of polygon) {
      for (const point of ring) {
        points.push(point);
      }
    }
  }
  if (points.length === 0) {
    return null;
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

  return [minLon, minLat, maxLon, maxLat];
}

function computeLabelPoint(bbox: [number, number, number, number] | null): [number, number] | null {
  if (!bbox) {
    return null;
  }
  return [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
}

function toIsoDateOnly(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00Z`;
  }
  return null;
}

export async function normalizeAip(options: NormalizeAipOptions): Promise<NormalizeAipResult> {
  const dataRoot = options.dataRoot ?? path.resolve(process.cwd(), "data", "airspace", "ee");
  const latestPath = path.join(dataRoot, "latest.json");
  const latestRaw = await fs.readFile(latestPath, "utf-8");
  const latest = JSON.parse(latestRaw) as { effectiveDate?: string; version?: string };

  const effectiveDate = latest.effectiveDate;
  if (!effectiveDate) {
    return { features: [] };
  }

  const geojsonPath = path.join(dataRoot, effectiveDate, "enr5_1.geojson");
  const geojsonRaw = await fs.readFile(geojsonPath, "utf-8");
  const geojson = JSON.parse(geojsonRaw) as { features?: AirspaceFeature[]; metadata?: Record<string, unknown> };
  const features = geojson.features ?? [];

  const effectiveFrom = toIsoDateOnly(effectiveDate);
  const validFrom = effectiveFrom ?? options.generatedAt;
  const validUntil = "2100-01-01T00:00:00Z";

  const result: InternalFeature[] = [];

  for (const feature of features) {
    if (!feature.geometry || !feature.properties) {
      continue;
    }
    if (feature.geometry.type !== "Polygon" && feature.geometry.type !== "MultiPolygon") {
      continue;
    }

    const classification = classifyAirspace(feature.properties);
    const vertical = parseVerticalLimitsFromSeparate(
      feature.properties.lowerLimit,
      feature.properties.upperLimit,
      options.rounding,
    );
    const time = unrollTime({
      validFrom,
      validUntil,
      generatedAt: options.generatedAt,
      lookaheadDays: options.lookaheadDays,
    });

    const geometry = feature.geometry.type === "Polygon"
      ? { type: "Polygon" as const, coordinates: feature.geometry.coordinates }
      : { type: "MultiPolygon" as const, coordinates: feature.geometry.coordinates };

    const bbox = computeBBox(
      feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates,
    );
    const labelPoint = computeLabelPoint(bbox);

    const designator = feature.properties.designator ?? "EAIP";
    const safeDesignator = designator.replace(/\s+/g, "");
    const id = `eff:EAIP:${safeDesignator}:perm`;

    result.push({
      feature: {
        type: "Feature",
        id,
        geometry,
        properties: {
          category: classification.category,
          restriction: classification.restriction,
          priority: classification.priority,
          tags: classification.tags,
          vertical,
          time: {
            ...time,
            original: {
              rawText: "PERM",
              note: "Permanent EAIP structure; sentinel validUntil used.",
            },
          },
          link: {
            relationType: "NEW",
            relatedTo: safeDesignator,
            supersedes: [],
          },
          provenance: {
            inputs: [{ source: "EAIP", id: safeDesignator }],
          },
          display: {
            title: feature.properties.name ?? designator,
            summary: `${classification.restriction} • ${designator}`,
            content: feature.properties.remarks ?? "EAIP airspace area.",
          },
          ...(labelPoint ? { labelPoint } : {}),
          ...(bbox ? { bbox } : {}),
        },
      },
      sourceId: safeDesignator,
      supersedes: [],
    });
  }

  const effectiveUntil = null;
  return {
    features: result,
    eaipVersion: latest.version ?? undefined,
    effectiveFrom: effectiveFrom ?? undefined,
    effectiveUntil: effectiveUntil ?? undefined,
  };
}
