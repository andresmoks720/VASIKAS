import Feature from "ol/Feature";
import { Polygon } from "ol/geom";

import { geofenceStore } from "@/services/geofences/geofenceStore";
import { Geofence } from "@/services/geofences/geofenceStore";
import { to3857 } from "@/map/transforms";
import { createGeofenceLayer } from "@/map/layers/geofences";

import { LayerController } from "./types";

export function createGeofencesLayerController(): LayerController<Geofence[]> {
  const layer = createGeofenceLayer();

  const setData = (geofences: Geofence[]) => {
    const source = layer.getSource();
    if (!source) return;

    source.clear();
    geofences.forEach((geofence) => {
      const poly = geofenceStore.asPolygon(geofence);
      const ring = poly.coordinates[0].map((pt: [number, number]) => to3857(pt));
      const center3857 =
        geofence.geometry.kind === "circle"
          ? to3857([geofence.geometry.center.lon, geofence.geometry.center.lat])
          : null;

      const feature = new Feature({
        geometry: new Polygon([ring]),
        name: geofence.name,
        center: center3857,
        entityKind: "geofence",
      });
      feature.setId(geofence.id);
      source.addFeature(feature);
    });
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
