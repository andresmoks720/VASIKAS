import type { InternalFeature, RestrictionFeature } from "./types";

export type MergeResult = {
  features: RestrictionFeature[];
  droppedSuperseded: number;
};

export function mergeFeatures(aip: InternalFeature[], notam: InternalFeature[]): MergeResult {
  const supersededIds = new Set<string>();
  for (const item of notam) {
    for (const superseded of item.supersedes) {
      supersededIds.add(superseded);
    }
  }

  let droppedSuperseded = 0;

  const filteredNotam = notam.filter(item => {
    if (supersededIds.has(item.sourceId)) {
      droppedSuperseded += 1;
      return false;
    }
    return true;
  });

  const combined = [...aip.map(item => item.feature), ...filteredNotam.map(item => item.feature)];

  const seen = new Set<string>();
  const deduped: RestrictionFeature[] = [];
  for (const feature of combined) {
    if (seen.has(feature.id)) {
      continue;
    }
    seen.add(feature.id);
    deduped.push(feature);
  }

  return { features: deduped, droppedSuperseded };
}
