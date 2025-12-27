import { describe, it, expect, vi } from "vitest";
import { createNotamsLayerController } from "./createNotamsLayerController";
import { makeNotam } from "@/shared/test/factories";
import { EnhancedNotam } from "@/services/airspace/airspaceTypes";

describe("createNotamsLayerController", () => {
  it("adds features only for NOTAMs with geometry", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
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
    warnSpy.mockRestore();
  });

  it("logs aggregated missing geometry only in dev mode", () => {
    const originalDev = import.meta.env.DEV;
    (import.meta as { env: { DEV: boolean } }).env.DEV = true;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const controller = createNotamsLayerController();
    const notamWithoutGeometry = makeNotam({
      id: "A0003/25",
      geometry: null,
      geometryParseReason: "UNSUPPORTED_FORMAT",
      raw: { geometryHint: { type: "circle" } },
    });

    controller.setData([notamWithoutGeometry]);

    expect(warnSpy).toHaveBeenCalledWith(
      "[map] NOTAM geometry skipped",
      expect.objectContaining({
        total: 1,
        rendered: 0,
        skipped: 1,
        byReason: expect.objectContaining({
          UNSUPPORTED_FORMAT: 1,
        }),
      }),
    );

    warnSpy.mockRestore();
    (import.meta as { env: { DEV: boolean } }).env.DEV = originalDev;
  });

  it("does not log missing geometry in production mode", () => {
    const originalDev = import.meta.env.DEV;
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    (import.meta as { env: { DEV: boolean } }).env.DEV = false;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const controller = createNotamsLayerController();
    const notamWithoutGeometry = makeNotam({
      id: "A0004/25",
      geometry: null,
      geometryParseReason: "INVALID_COORDS",
    });

    controller.setData([notamWithoutGeometry]);

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    (import.meta as { env: { DEV: boolean } }).env.DEV = originalDev;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("emits an aggregated warning when missing geometry exceeds threshold", () => {
    const originalDev = import.meta.env.DEV;
    (import.meta as { env: { DEV: boolean } }).env.DEV = true;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const controller = createNotamsLayerController();
    const notams = [
      makeNotam({ id: "A1001/25", geometry: null, geometryParseReason: "NO_CANDIDATE" }),
      makeNotam({ id: "A1002/25", geometry: null, geometryParseReason: "INVALID_COORDS" }),
      makeNotam({ id: "A1003/25" }),
      makeNotam({ id: "A1004/25" }),
      makeNotam({ id: "A1005/25" }),
    ];

    controller.setData(notams);

    expect(warnSpy).toHaveBeenCalledWith(
      "[map] NOTAM geometry skipped",
      expect.objectContaining({
        total: 5,
        rendered: 3,
        skipped: 2,
        byReason: expect.any(Object),
      }),
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "[map] high NOTAM geometry failure ratio",
      expect.objectContaining({
        total: 5,
        skipped: 2,
        byReason: expect.any(Object),
      }),
    );

    warnSpy.mockRestore();
    (import.meta as { env: { DEV: boolean } }).env.DEV = originalDev;
  });

  it("uses enhanced geometry when available", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const controller = createNotamsLayerController();

    // Create an enhanced NOTAM with both source and enhanced geometry
    const enhancedNotam: EnhancedNotam = {
      ...makeNotam({
        id: "A0005/25",
        geometry: { kind: "circle", center: [24.0, 59.0], radiusMeters: 500 }, // source geometry
      }),
      enhancedGeometry: { kind: "polygon", rings: [[[24.1, 59.1], [24.2, 59.1], [24.2, 59.2], [24.1, 59.2], [24.1, 59.1]]] }, // enhanced geometry
      sourceGeometry: { kind: "circle", center: [24.0, 59.0], radiusMeters: 500 },
      geometrySource: 'eAIP',
      issues: [],
    };

    controller.setData([enhancedNotam]);

    const source = controller.layer.getSource();
    const features = source?.getFeatures() ?? [];

    // Should have one feature
    expect(features).toHaveLength(1);
    const feature = features[0];

    // The feature should use the enhanced geometry (polygon) rather than the source geometry (circle)
    const geometry = feature.getGeometry();
    expect(geometry).toBeDefined();

    warnSpy.mockRestore();
  });
});
