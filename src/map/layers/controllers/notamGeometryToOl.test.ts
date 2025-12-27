import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { parseGeometryHint, parseNotamGeometryWithReason } from "@/services/notam/geometry/geometryParsers";
import type { NotamGeometry } from "@/services/notam/notamTypes";
import { notamGeometryToOl } from "./createNotamsLayerController";

const FIXTURE_DIR = resolve(process.cwd(), "test/fixtures/notams");
const loadFixture = <T,>(name: string): T =>
  JSON.parse(readFileSync(resolve(FIXTURE_DIR, `${name}.json`), "utf8")) as T;

const legacyCircle = loadFixture("legacy-circle");
const geojsonPolygon = loadFixture("geojson-polygon");
const geojsonPolygonHoles = loadFixture("geojson-polygon-holes");
const geojsonMultiPolygon = loadFixture("geojson-multipolygon");

const expectFiniteCoordinate = (coords: number[] | number | undefined) => {
  if (!Array.isArray(coords)) {
    expect(false).toBe(true);
    return;
  }
  for (const coord of coords) {
    expect(Number.isFinite(coord)).toBe(true);
  }
};

describe("notamGeometryToOl", () => {
  it("converts circle geometry into an OL polygon", () => {
    const result = parseGeometryHint(legacyCircle);
    expect(result.geometry?.kind).toBe("circle");

    expect(() => notamGeometryToOl(result.geometry)).not.toThrow();
    const olGeometry = notamGeometryToOl(result.geometry);

    expect(olGeometry).not.toBeNull();
    expect(olGeometry?.getType()).toBe("Polygon");
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords.length).toBeGreaterThan(0);
    expectFiniteCoordinate(coords[0]?.[0] as number[] | undefined);
    const extent = olGeometry?.getExtent();
    expect(extent).toBeDefined();
    if (extent) {
      expect(extent[2] - extent[0]).toBeGreaterThan(0);
      expect(extent[3] - extent[1]).toBeGreaterThan(0);
    }
  });

  it("converts polygon geometry into an OL polygon", () => {
    const result = parseNotamGeometryWithReason(geojsonPolygon);
    expect(result.geometry?.kind).toBe("polygon");

    expect(() => notamGeometryToOl(result.geometry)).not.toThrow();
    const olGeometry = notamGeometryToOl(result.geometry);

    expect(olGeometry).not.toBeNull();
    expect(olGeometry?.getType()).toBe("Polygon");
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords.length).toBeGreaterThan(0);
    expectFiniteCoordinate(coords[0]?.[0] as number[] | undefined);
  });

  it("preserves hole rings in OL polygon conversion", () => {
    const result = parseNotamGeometryWithReason(geojsonPolygonHoles);
    expect(result.geometry?.kind).toBe("polygon");

    const olGeometry = notamGeometryToOl(result.geometry);
    expect(olGeometry?.getType()).toBe("Polygon");
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords).toHaveLength(2);
  });

  it("converts multipolygon geometry into an OL multipolygon", () => {
    const result = parseNotamGeometryWithReason(geojsonMultiPolygon);
    expect(result.geometry?.kind).toBe("multiPolygon");

    expect(() => notamGeometryToOl(result.geometry)).not.toThrow();
    const olGeometry = notamGeometryToOl(result.geometry);

    expect(olGeometry).not.toBeNull();
    expect(olGeometry?.getType()).toBe("MultiPolygon");
    const coords = olGeometry?.getCoordinates() ?? [];
    expect(coords.length).toBeGreaterThan(0);
    expectFiniteCoordinate(coords[0]?.[0]?.[0] as number[] | undefined);
  });

  it("returns null for null or unsupported geometry", () => {
    expect(() => notamGeometryToOl(null)).not.toThrow();
    expect(notamGeometryToOl(null)).toBeNull();

    const invalid = { kind: "unknown" } as unknown as NotamGeometry;
    expect(() => notamGeometryToOl(invalid)).not.toThrow();
    expect(notamGeometryToOl(invalid)).toBeNull();
  });
});
