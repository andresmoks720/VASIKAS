import { fetchNotamPib } from "./fetch_notam_pib";
import { normalizeNotamPayload } from "./normalize_notam";
import { normalizeAip } from "./normalize_aip";
import { mergeFeatures } from "./merge";
import type { RestrictionFeatureCollection } from "./types";
import { validateUnifiedRestriction } from "./validate";

export type NormalizeOptions = {
  lookaheadDays?: number;
  rounding?: {
    distance_m?: number;
    altitude_m?: number;
  };
  parserVersion?: string;
  notamUrl?: string;
  dataRoot?: string;
};

function isActiveNow(feature: RestrictionFeatureCollection["features"][number], nowIso: string): boolean {
  const now = new Date(nowIso).getTime();
  return feature.properties.time.activations.some(window => {
    const start = new Date(window.start).getTime();
    const end = new Date(window.end).getTime();
    return now >= start && now <= end;
  });
}

export async function normalizeUnifiedRestrictions(options: NormalizeOptions = {}): Promise<RestrictionFeatureCollection> {
  const generatedAt = new Date().toISOString();
  const lookaheadDays = options.lookaheadDays ?? 7;
  const rounding = {
    distance_m: options.rounding?.distance_m ?? 1,
    altitude_m: options.rounding?.altitude_m ?? 1,
  };

  const notamFetch = await fetchNotamPib(options.notamUrl);
  const notamNormalized = normalizeNotamPayload(notamFetch.payload, {
    generatedAt,
    lookaheadDays,
    rounding: { altitude_m: rounding.altitude_m },
  });

  const aipNormalized = await normalizeAip({
    dataRoot: options.dataRoot,
    generatedAt,
    lookaheadDays,
    rounding: { altitude_m: rounding.altitude_m },
  });

  const merged = mergeFeatures(aipNormalized.features, notamNormalized.features);

  const activeNow = merged.features.filter(feature => isActiveNow(feature, generatedAt)).length;

  const output: RestrictionFeatureCollection = {
    type: "FeatureCollection",
    generatedAt,
    lookaheadDays,
    units: { distance: "m", altitude: "m" },
    rounding,
    metadata: {
      parserVersion: options.parserVersion ?? "normalize@0.1.0",
      sources: {
        notamFetchedAt: notamFetch.fetchedAt,
        ...(aipNormalized.eaipVersion ? { eaipVersion: aipNormalized.eaipVersion } : {}),
        ...(aipNormalized.effectiveFrom ? { aipEffectiveFrom: aipNormalized.effectiveFrom } : {}),
        ...(aipNormalized.effectiveUntil ? { aipEffectiveUntil: aipNormalized.effectiveUntil } : {}),
      },
      counts: {
        total: merged.features.length,
        activeNow,
      },
    },
    features: merged.features,
  };

  const validation = validateUnifiedRestriction(output);
  if (!validation.valid) {
    const message = validation.errors?.join("; ") ?? "schema validation failed";
    throw new Error(message);
  }

  return output;
}
