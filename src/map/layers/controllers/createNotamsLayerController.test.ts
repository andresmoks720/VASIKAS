import { describe, it, expect } from "vitest";
import { createNotamsLayerController } from "./createNotamsLayerController";
import { makeNotam } from "@/shared/test/factories";

describe("createNotamsLayerController", () => {
  it("adds features only for NOTAMs with geometry", () => {
    const controller = createNotamsLayerController();
    const notamWithGeometry = makeNotam({
      id: "A0001/25",
      geometry: { kind: "circle", center: [24.7, 59.4], radiusMeters: 1200 },
    });
    const notamWithoutGeometry = makeNotam({
      id: "A0002/25",
      geometry: null,
    });

    controller.setData([notamWithGeometry, notamWithoutGeometry]);

    const source = controller.layer.getSource();
    const features = source?.getFeatures() ?? [];

    expect(features).toHaveLength(1);
    expect(source?.getFeatureById("A0001/25")).toBeTruthy();
    expect(source?.getFeatureById("A0002/25")).toBeNull();
  });
});
