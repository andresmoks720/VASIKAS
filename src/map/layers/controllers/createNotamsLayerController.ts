import Feature from "ol/Feature";
import { Circle as CircleGeom, MultiPolygon, Polygon } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";

import { NormalizedNotam, NotamGeometry } from "@/services/notam/notamTypes";
import { EnhancedNotam } from "@/services/airspace/airspaceTypes";
import { to3857 } from "@/map/transforms";
import { createNotamLayer } from "@/map/layers/notams";

import { LayerController } from "./types";

const isDevLoggingEnabled = () =>
  import.meta.env.DEV && (typeof process === "undefined" || process.env.NODE_ENV !== "production");

const notamGeometryTelemetry = {
  total: 0,
  rendered: 0,
  skipped: 0,
  byReason: {} as Record<string, number>,
};

function recordTelemetrySnapshot(batchStats: {
  total: number;
  rendered: number;
  skipped: number;
  byReason: Record<string, number>;
}) {
  if (!isDevLoggingEnabled()) return;
  notamGeometryTelemetry.total += batchStats.total;
  notamGeometryTelemetry.rendered += batchStats.rendered;
  notamGeometryTelemetry.skipped += batchStats.skipped;
  for (const [reason, count] of Object.entries(batchStats.byReason)) {
    notamGeometryTelemetry.byReason[reason] = (notamGeometryTelemetry.byReason[reason] ?? 0) + count;
  }
}

export function notamGeometryToOl(geometry: NotamGeometry): Polygon | MultiPolygon | null {
  if (!geometry) return null;

  if (geometry.kind === "circle") {
    const center3857 = to3857(geometry.center);
    const circle = new CircleGeom(center3857, geometry.radiusMeters);
    return fromCircle(circle, 64);
  }

  if (geometry.kind === "polygon") {
    const rings = geometry.rings.map((ring) => ring.map((coord) => to3857(coord)));
    return new Polygon(rings);
  }

  if (geometry.kind === "multiPolygon") {
    const polygons = geometry.polygons.map((polygon) =>
      polygon.map((ring) => ring.map((coord) => to3857(coord))),
    );
    return new MultiPolygon(polygons);
  }

  return null;
}

export function createNotamsLayerController(): LayerController<NormalizedNotam[] | EnhancedNotam[]> {
  const layer = createNotamLayer();

  const setData = (notams: NormalizedNotam[] | EnhancedNotam[]) => {
    const source = layer.getSource();
    if (!source) return;

    source.clear();
    let missingGeometryCount = 0;
    const batchStats = { total: notams.length, rendered: 0, skipped: 0, byReason: {} as Record<string, number> };
    notams.forEach((notam) => {
      // Use enhanced geometry if available, otherwise use original geometry
      const geometryToUse = ('enhancedGeometry' in notam)
        ? (notam.enhancedGeometry ?? notam.sourceGeometry)
        : notam.geometry;
      const geom = notamGeometryToOl(geometryToUse);
      if (!geom) {
        missingGeometryCount += 1;
        batchStats.skipped += 1;
        const reason = ('geometryParseReason' in notam) ? notam.geometryParseReason : "UNKNOWN";
        batchStats.byReason[reason ?? "UNKNOWN"] = (batchStats.byReason[reason ?? "UNKNOWN"] ?? 0) + 1;
        return;
      }
      batchStats.rendered += 1;
      const feature = new Feature({
        notamId: notam.id,
        summary: notam.summary,
        validFromUtc: notam.validFromUtc,
        validToUtc: notam.validToUtc,
        entityKind: "notam",
        // Add additional properties for enhanced notams
        geometrySource: notam.geometrySource,
        enhanced: ('enhancedGeometry' in notam) ? true : false,
      });
      feature.setGeometry(geom);
      feature.setId(notam.id);
      source.addFeature(feature);
    });

    if (isDevLoggingEnabled()) {
      recordTelemetrySnapshot(batchStats);
      if (batchStats.skipped > 0) {
        const failureRatio = batchStats.total > 0 ? batchStats.skipped / batchStats.total : 0;
        // eslint-disable-next-line no-console
        console.warn("[map] NOTAM geometry skipped", {
          total: batchStats.total,
          rendered: batchStats.rendered,
          skipped: batchStats.skipped,
          byReason: batchStats.byReason,
        });
        if (failureRatio > 0.2) {
          // eslint-disable-next-line no-console
          console.warn("[map] high NOTAM geometry failure ratio", {
            total: batchStats.total,
            skipped: batchStats.skipped,
            byReason: batchStats.byReason,
          });
        }
      }
    }
  };

  const dispose = () => {
    layer.getSource()?.clear();
  };

  return {
    layer,
    setData,
    dispose,
  };
}
