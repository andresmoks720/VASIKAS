import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import SimpleGeometry from "ol/geom/SimpleGeometry";
import VectorSource from "ol/source/Vector";

import { LonLat, to3857 } from "@/map/transforms";

type UpsertResult = {
  feature: Feature;
  added: boolean;
  updated: boolean;
};

function coordinatesEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }

  for (let index = 0; index < a.length; index += 1) {
    const left = a[index];
    const right = b[index];
    const bothArrays = Array.isArray(left) || Array.isArray(right);
    if (bothArrays) {
      if (!coordinatesEqual(left, right)) {
        return false;
      }
      continue;
    }

    if (left !== right) {
      return false;
    }
  }

  return true;
}

export function updateGeometryIfChanged(feature: Feature, newGeometry: SimpleGeometry): boolean {
  const currentGeometry = feature.getGeometry();

  if (!currentGeometry) {
    feature.setGeometry(newGeometry);
    return true;
  }

  if (currentGeometry.getType() !== newGeometry.getType()) {
    feature.setGeometry(newGeometry);
    return true;
  }

  if (!(currentGeometry instanceof SimpleGeometry)) {
    feature.setGeometry(newGeometry);
    return true;
  }

  const currentCoordinates = currentGeometry.getCoordinates();
  const nextCoordinates = newGeometry.getCoordinates();

  if (!coordinatesEqual(currentCoordinates, nextCoordinates)) {
    feature.setGeometry(newGeometry);
    return true;
  }

  return false;
}

export function upsertPointFeature(
  source: VectorSource,
  id: string,
  lonLat4326: LonLat,
  props: Record<string, unknown>,
): UpsertResult {
  const existing = source.getFeatureById(id) as Feature<Point> | null;
  const point = new Point(to3857(lonLat4326));

  if (existing) {
    const updated = updateGeometryIfChanged(existing, point);
    existing.setProperties(props);
    return { feature: existing, added: false, updated };
  }

  const feature = new Feature({ geometry: point, ...props });
  feature.setId(id);
  source.addFeature(feature);
  return { feature, added: true, updated: false };
}

export function removeMissingFeatures(
  source: VectorSource,
  allowedIdsSet: Set<string>,
  idPrefix?: string,
): number {
  let removedCount = 0;

  source.getFeatures().forEach((feature) => {
    const rawId = feature.getId();
    if (rawId === undefined || rawId === null) {
      return;
    }

    const id = String(rawId);
    if (idPrefix && !id.startsWith(idPrefix)) {
      return;
    }

    const comparableId = idPrefix ? id.slice(idPrefix.length) : id;
    if (allowedIdsSet.has(comparableId)) {
      return;
    }

    source.removeFeature(feature);
    removedCount += 1;
  });

  return removedCount;
}
