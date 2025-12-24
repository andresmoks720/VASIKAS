import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { EntityRef } from "@/layout/MapShell/urlState";
import { Drone } from "@/services/drones/droneTypes";
import { to3857 } from "@/map/transforms";

import { buildPlaceholderDroneTracks } from "./droneTracks";
import { LayerController } from "./types";

export type DronesLayerData = {
  drones: Drone[];
  visibleTrackIds: Set<string>;
};

export function createDronesLayerController(): LayerController<DronesLayerData> {
  let selectedEntity: EntityRef | null = null;

  const layer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      const isTrack = feature.get("isTrack") === true;
      const droneId = feature.get("droneId") as string | undefined;
      const selectedId = selectedEntity?.kind === "drone" ? selectedEntity.id : null;
      const selected = (droneId && droneId === selectedId) || feature.getId() === selectedId;

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

    source.getFeatures().forEach((feature) => {
      const id = String(feature.getId() ?? "");
      if (id.startsWith("droneTrack:")) {
        source.removeFeature(feature);
      }
    });

    const tracks = buildPlaceholderDroneTracks(drones, visibleTrackIds);
    tracks.forEach((points, id) => {
      if (points.length < 2) return;
      const coords = points.map((pt) => to3857([pt.position.lon, pt.position.lat]));
      const line = new LineString(coords);
      const feature = new Feature({
        geometry: line,
        entityKind: "drone",
        droneId: id,
        isTrack: true,
      });
      feature.setId(`droneTrack:${id}`);
      source.addFeature(feature);
    });

    drones.forEach((drone) => {
      const point = new Point(to3857([drone.position.lon, drone.position.lat]));
      const existing = source.getFeatureById(drone.id) as Feature<Point> | null;
      if (existing) {
        existing.setGeometry(point);
      } else {
        const pointFeature = new Feature({ geometry: point, entityKind: "drone" });
        pointFeature.setId(drone.id);
        source.addFeature(pointFeature);
      }
    });

    layer.changed();
  };

  const setSelection = (entity: EntityRef | null) => {
    selectedEntity = entity;
    layer.changed();
  };

  const dispose = () => {
    layer.getSource()?.clear();
  };

  return {
    layer,
    setData,
    setSelection,
    dispose,
  };
}
