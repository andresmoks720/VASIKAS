import Feature from "ol/Feature";
import { Circle as CircleGeom, MultiPolygon, Polygon } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";

import { NormalizedNotam, NotamGeometry } from "@/services/notam/notamTypes";
import { to3857 } from "@/map/transforms";
import { createNotamLayer } from "@/map/layers/notams";

import { LayerController } from "./types";

const GEOMETRY_KEYS = [
  "geometryHint",
  "geometry",
  "geojson",
  "geoJson",
  "shape",
  "area",
  "polygon",
  "circle",
] as const;

function getGeometryFieldSnapshot(raw: NormalizedNotam["raw"]): Record<string, boolean> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const record = raw as Record<string, unknown>;
  return Object.fromEntries(
    GEOMETRY_KEYS.map((key) => [key, record[key] !== undefined && record[key] !== null]),
  );
}

function notamGeometryToOl(geometry: NotamGeometry): Polygon | MultiPolygon | null {
  if (!geometry) return null;

  if (geometry.kind === "circle") {
    const center3857 = to3857(geometry.center);
    const circle = new CircleGeom(center3857, geometry.radiusMeters);
    return fromCircle(circle, 64);
  }

  if (geometry.kind === "polygon") {
    const rings = geometry.coordinates.map((ring) => ring.map((coord) => to3857(coord)));
    return new Polygon(rings);
  }

  if (geometry.kind === "multiPolygon") {
    const polygons = geometry.coordinates.map((polygon) =>
      polygon.map((ring) => ring.map((coord) => to3857(coord))),
    );
    return new MultiPolygon(polygons);
  }

  return null;
}

export function createNotamsLayerController(): LayerController<NormalizedNotam[]> {
  const layer = createNotamLayer();

  const setData = (notams: NormalizedNotam[]) => {
    const source = layer.getSource();
    if (!source) return;

    source.clear();
    let missingGeometryCount = 0;
    notams.forEach((notam) => {
      const geom = notamGeometryToOl(notam.geometry);
      if (!geom) {
        missingGeometryCount += 1;
        if (import.meta.env.DEV) {
          const presentFields = getGeometryFieldSnapshot(notam.raw);
          // eslint-disable-next-line no-console
          console.debug("[map] notam missing geometry", {
            id: notam.id,
            presentFields,
            reason: notam.geometryParseReason,
          });
        }
        return;
      }
      const feature = new Feature({
        notamId: notam.id,
        summary: notam.summary,
        validFromUtc: notam.validFromUtc,
        validToUtc: notam.validToUtc,
        entityKind: "notam",
      });
      feature.setGeometry(geom);
      feature.setId(notam.id);
      source.addFeature(feature);
    });

    if (import.meta.env.DEV && missingGeometryCount > 0) {
      // eslint-disable-next-line no-console
      console.debug("[map] notams without geometry", {
        count: missingGeometryCount,
      });
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
