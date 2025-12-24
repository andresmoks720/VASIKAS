import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleGeom } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { EntityRef } from "@/layout/MapShell/urlState";
import { Sensor } from "@/services/sensors/sensorsTypes";
import { to3857 } from "@/map/transforms";

import { LayerController } from "./types";

export function createSensorsLayerController(): LayerController<Sensor[]> {
  let selectedEntity: EntityRef | null = null;

  const layer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      const isCoverage = feature.get("isCoverage") === true;
      const sensorId = String(feature.getId() ?? "").replace("-coverage", "");
      const selected = selectedEntity?.kind === "sensor" && selectedEntity?.id === sensorId;

      if (isCoverage) {
        return new Style({
          stroke: new Stroke({
            color: "#2196f3",
            width: 1,
            lineDash: [4, 4],
          }),
          fill: new Fill({
            color: "rgba(33, 150, 243, 0.15)",
          }),
        });
      }

      return new Style({
        image: new CircleStyle({
          radius: selected ? 8 : 6,
          fill: new Fill({ color: selected ? "#1565c0" : "#2196f3" }),
          stroke: new Stroke({ color: "#0d47a1", width: selected ? 3 : 2 }),
        }),
      });
    },
  });

  const setData = (sensors: Sensor[]) => {
    const source = layer.getSource();
    if (!source) return;

    source.clear();

    sensors.forEach((sensor) => {
      const center = to3857([sensor.position.lon, sensor.position.lat]);

      const radius = sensor.coverage?.radiusMeters ?? 3000;
      const coverageCircle = new CircleGeom(center, radius);
      const coverageFeature = new Feature({
        geometry: fromCircle(coverageCircle, 64),
        sensorId: sensor.id,
        entityKind: "sensor",
        isCoverage: true,
      });
      coverageFeature.setId(`${sensor.id}-coverage`);
      source.addFeature(coverageFeature);

      const feature = new Feature({
        geometry: new Point(center),
        sensorId: sensor.id,
        entityKind: "sensor",
      });
      feature.setId(sensor.id);
      source.addFeature(feature);
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
