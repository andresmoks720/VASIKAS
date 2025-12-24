import Feature from "ol/Feature";
import { Circle as CircleGeom } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";
import { Polygon } from "ol/geom";

import { NormalizedNotam, NotamGeometry } from "@/services/notam/notamTypes";
import { to3857 } from "@/map/transforms";
import { createNotamLayer } from "@/map/layers/notams";

import { LayerController } from "./types";

function notamGeometryToOl(geometry: NotamGeometry): Polygon | null {
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
      const feature = new Feature({
        notamId: notam.id,
        summary: notam.summary,
        validFromUtc: notam.validFromUtc,
        validToUtc: notam.validToUtc,
        entityKind: "notam",
      });
      if (geom) {
        feature.setGeometry(geom);
      } else {
        missingGeometryCount += 1;
      }
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
