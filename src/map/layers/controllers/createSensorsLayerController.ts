import Feature from "ol/Feature";
import { Circle as CircleGeom } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { Sensor } from "@/services/sensors/sensorsTypes";
import { to3857 } from "@/map/transforms";
import {
  removeMissingFeatures,
  updateGeometryIfChanged,
  upsertPointFeature,
} from "@/map/utils/featureUpsert";

import { LayerController } from "./types";

export function createSensorsLayerController(): LayerController<Sensor[]> {
  const layer = new VectorLayer({
    source: new VectorSource(),
    style: (feature) => {
      const isCoverage = feature.get("isCoverage") === true;
      const selected = feature.get("selected") === true;

      if (isCoverage) {
        return new Style({
          stroke: new Stroke({
            color: selected ? "#1565c0" : "#2196f3",
            width: selected ? 2 : 1,
            lineDash: [4, 4],
          }),
          fill: new Fill({
            color: selected ? "rgba(21, 101, 192, 0.2)" : "rgba(33, 150, 243, 0.15)",
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

    let addedCount = 0;
    let updatedCount = 0;
    let removedCount = 0;
    const allowedIds = new Set<string>();

    sensors.forEach((sensor) => {
      const center = to3857([sensor.position.lon, sensor.position.lat]);
      allowedIds.add(sensor.id);
      allowedIds.add(`${sensor.id}-coverage`);

      const radius = sensor.coverage?.radiusMeters ?? 3000;
      const coverageCircle = new CircleGeom(center, radius);
      const coverageFeature = new Feature({
        geometry: fromCircle(coverageCircle, 64),
        sensorId: sensor.id,
        entityKind: "sensor",
        isCoverage: true,
      });
      coverageFeature.setId(`${sensor.id}-coverage`);
      const existingCoverage = source.getFeatureById(`${sensor.id}-coverage`) as
        | Feature
        | null;
      if (existingCoverage) {
        const geometryUpdated = updateGeometryIfChanged(
          existingCoverage,
          coverageFeature.getGeometry()!,
        );
        existingCoverage.setProperties({
          sensorId: sensor.id,
          entityKind: "sensor",
          isCoverage: true,
        });
        if (geometryUpdated) {
          updatedCount += 1;
        }
      } else {
        source.addFeature(coverageFeature);
        addedCount += 1;
      }

      const result = upsertPointFeature(
        source,
        sensor.id,
        [sensor.position.lon, sensor.position.lat],
        { sensorId: sensor.id, entityKind: "sensor" },
      );
      if (result.added) {
        addedCount += 1;
      } else if (result.updated) {
        updatedCount += 1;
      }
    });

    removedCount += removeMissingFeatures(source, allowedIds);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[map] sensors layer update", {
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
