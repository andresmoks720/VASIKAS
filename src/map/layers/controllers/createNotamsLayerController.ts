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

function resetTelemetry() {
  notamGeometryTelemetry.total = 0;
  notamGeometryTelemetry.rendered = 0;
  notamGeometryTelemetry.skipped = 0;
  notamGeometryTelemetry.byReason = {};
}

function isValidCoord(coord: unknown): coord is [number, number] {
  return (
    Array.isArray(coord) &&
    coord.length === 2 &&
    typeof coord[0] === "number" &&
    !isNaN(coord[0]) &&
    typeof coord[1] === "number" &&
    !isNaN(coord[1]) &&
    coord[0] >= -180 &&
    coord[0] <= 180 &&
    coord[1] >= -90 &&
    coord[1] <= 90
  );
}

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
    if (!isValidCoord(geometry.center)) return null;
    const center3857 = to3857(geometry.center);
    const circle = new CircleGeom(center3857, geometry.radiusMeters);
    return fromCircle(circle, 64);
  }

  if (geometry.kind === "polygon") {
    const rings = geometry.rings.map((ring) =>
      ring
        .filter((coord) => isValidCoord(coord))
        .map((coord) => to3857(coord))
    );
    if (rings.length === 0 || rings[0].length < 3) return null;
    return new Polygon(rings);
  }

  if (geometry.kind === "multiPolygon") {
    const polygons = geometry.polygons.map((polygon) =>
      polygon.map((ring) =>
        ring
          .filter((coord) => isValidCoord(coord))
          .map((coord) => to3857(coord))
      )
    );
    const filteredPolygons = polygons.filter(p => p.length > 0 && p[0].length >= 3);
    if (filteredPolygons.length === 0) return null;
    return new MultiPolygon(filteredPolygons);
  }

  return null;
}

export function createNotamsLayerController(): LayerController<NormalizedNotam[] | EnhancedNotam[]> {
  const layer = createNotamLayer();

  const setData = (notams: NormalizedNotam[] | EnhancedNotam[]) => {
    const source = layer.getSource();
    if (!source) return;

    source.clear();
    resetTelemetry();
    const batchStats = { total: notams.length, rendered: 0, skipped: 0, byReason: {} as Record<string, number> };
    notams.forEach((notam) => {
      // Use enhanced geometry if available, otherwise use original geometry
      const hasEnhanced = 'enhancedGeometry' in notam && notam.enhancedGeometry !== null;
      let geometryToUse = notam.geometry;

      if ('enhancedGeometry' in notam) {
        const enhanced = notam as EnhancedNotam;
        geometryToUse = enhanced.enhancedGeometry ?? enhanced.sourceGeometry;
      }

      const geom = notamGeometryToOl(geometryToUse);
      if (!geom) {
        batchStats.skipped += 1;
        const reason = ('geometryParseReason' in notam) ? notam.geometryParseReason : "UNKNOWN";
        batchStats.byReason[reason ?? "UNKNOWN"] = (batchStats.byReason[reason ?? "UNKNOWN"] ?? 0) + 1;
        return;
      }

      batchStats.rendered += 1;

      // Determine the effective source for the geometry being drawn
      let effectiveSource = notam.geometrySource;
      if ('enhancedGeometry' in notam) {
        effectiveSource = hasEnhanced ? notam.geometrySource : (notam as EnhancedNotam).sourceGeometrySource || 'notamText';
        // Note: NotamAirspaceIndex.ts sets geometrySource to the enhanced source (html/geojson) 
        // when matching airspace is found. If no match, it keeps original.
      }

      const feature = new Feature({
        notamId: notam.id,
        summary: notam.summary,
        validFromUtc: notam.validFromUtc,
        validToUtc: notam.validToUtc,
        entityKind: "notam",
        // Add additional properties for enhanced notams
        geometrySource: effectiveSource,
        geometrySourceDetails: notam.geometrySourceDetails,
        enhanced: hasEnhanced,
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
