import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { Drone } from "@/services/drones/droneTypes";
import { to3857 } from "@/map/transforms";
import {
  removeMissingFeatures,
  updateGeometryIfChanged,
  upsertPointFeature,
} from "@/map/utils/featureUpsert";

import { buildPlaceholderDroneTracks } from "./droneTracks";
import { LayerController } from "./types";

export type DronesLayerData = {
  drones: Drone[];
  visibleTrackIds: Set<string>;
};

export function createDronesLayerController(): LayerController<DronesLayerData> {
  const layer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      const isTrack = feature.get("isTrack") === true;
      const selected = feature.get("selected") === true;

      if (isTrack) {
        return new Style({
          stroke: new Stroke({
            color: selected ? "#1b5e20" : "#4caf50",
            width: selected ? 3 : 2,
            lineDash: [4, 4],
          }),
        });
      }

      return new Style({
        image: new CircleStyle({
          radius: selected ? 9 : 7,
          fill: new Fill({ color: selected ? "#2e7d32" : "#4caf50" }),
          stroke: new Stroke({ color: "#1b5e20", width: selected ? 3 : 2 }),
        }),
      });
    },
  });

  const setData = ({ drones, visibleTrackIds }: DronesLayerData) => {
    const source = layer.getSource();
    if (!source) return;

    let addedCount = 0;
    let updatedCount = 0;
    let removedCount = 0;

    const tracks = buildPlaceholderDroneTracks(drones, visibleTrackIds);
    const allowedTrackIds = new Set<string>();
    tracks.forEach((points, id) => {
      if (points.length < 2) return;
      allowedTrackIds.add(id);
      const coords = points.map((pt) => to3857([pt.position.lon, pt.position.lat]));
      const line = new LineString(coords);

      const featureId = `droneTrack:${id}`;
      const existing = source.getFeatureById(featureId) as Feature<LineString> | null;
      if (existing) {
        const geometryUpdated = updateGeometryIfChanged(existing, line);
        existing.setProperties({ entityKind: "drone", droneId: id, isTrack: true });
        if (geometryUpdated) {
          updatedCount += 1;
        }
      } else {
        const feature = new Feature({
          geometry: line,
          entityKind: "drone",
          droneId: id,
          isTrack: true,
        });
        feature.setId(featureId);
        source.addFeature(feature);
        addedCount += 1;
      }
    });

    const allowedDroneIds = new Set<string>();
    drones.forEach((drone) => {
      allowedDroneIds.add(drone.id);
      const result = upsertPointFeature(
        source,
        drone.id,
        [drone.position.lon, drone.position.lat],
        { entityKind: "drone", droneId: drone.id },
      );
      if (result.added) {
        addedCount += 1;
      } else if (result.updated) {
        updatedCount += 1;
      }
    });

    const allowedIds = new Set<string>();
    allowedDroneIds.forEach((id) => allowedIds.add(id));
    allowedTrackIds.forEach((id) => allowedIds.add(`droneTrack:${id}`));
    removedCount += removeMissingFeatures(source, allowedIds);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[map] drones layer update", {
        added: addedCount,
        updated: updatedCount,
        removed: removedCount,
      });
    }

    layer.changed();
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
