import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import { createSelectionManager } from "./selectionManager";
import { EntityRef } from "@/layout/MapShell/urlState";

const makeFeature = () => new Feature({ geometry: new Point([0, 0]) });

describe("selectionManager", () => {
  it("sets selected on resolved features", () => {
    const droneFeature = makeFeature();
    const trackFeature = makeFeature();
    const resolve = (entity: EntityRef) =>
      entity.kind === "drone" && entity.id === "dr-1" ? [droneFeature, trackFeature] : [];

    const manager = createSelectionManager(resolve);
    manager.setSelectedEntity({ kind: "drone", id: "dr-1" });

    expect(droneFeature.get("selected")).toBe(true);
    expect(trackFeature.get("selected")).toBe(true);
  });

  it("clears previous selection when changing entity", () => {
    const sensorFeature = makeFeature();
    const droneFeature = makeFeature();
    const resolve = (entity: EntityRef) => {
      if (entity.kind === "sensor") return [sensorFeature];
      if (entity.kind === "drone") return [droneFeature];
      return [];
    };

    const manager = createSelectionManager(resolve);
    manager.setSelectedEntity({ kind: "sensor", id: "s-1" });
    manager.setSelectedEntity({ kind: "drone", id: "d-1" });

    expect(sensorFeature.get("selected")).toBe(false);
    expect(droneFeature.get("selected")).toBe(true);
  });

  it("clears selection when entity becomes null", () => {
    const feature = makeFeature();
    const resolve = (entity: EntityRef) =>
      entity.kind === "sensor" && entity.id === "s-1" ? [feature] : [];

    const manager = createSelectionManager(resolve);
    manager.setSelectedEntity({ kind: "sensor", id: "s-1" });
    manager.setSelectedEntity(null);

    expect(feature.get("selected")).toBe(false);
  });
});
