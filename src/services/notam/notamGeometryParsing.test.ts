import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  normalizeNotamItem,
  normalizeNotams,
  parseGeometryHint,
  parseNotamGeometryWithReason,
} from "./notamInterpreter";

const FIXTURE_DIR = resolve(process.cwd(), "test/fixtures/notams");
const SAMPLE_FIXTURE_PATH = resolve(process.cwd(), "test/fixtures/geometry-edgecases.sample.json");
const CONTRACT_FIXTURE_PATH = resolve(process.cwd(), "test/fixtures/notams.geometry.contract.json");
const EVENT_TIME = "2025-12-18T12:00:00Z";

const loadFixture = <T,>(name: string): T =>
  JSON.parse(readFileSync(resolve(FIXTURE_DIR, `${name}.json`), "utf8")) as T;

const fixtures = {
  legacyCircle: loadFixture("legacy-circle"),
  circleRadiusNmString: loadFixture("circle-radius-nm-string"),
  legacyPolygon: loadFixture("legacy-polygon"),
  geojsonPolygon: loadFixture("geojson-polygon"),
  geojsonFeaturePolygon: loadFixture("geojson-feature-polygon"),
  geojsonFeatureCollection: loadFixture("geojson-featurecollection"),
  geojsonMultiPolygon: loadFixture("geojson-multipolygon"),
  geojsonPolygonHoles: loadFixture("geojson-polygon-holes"),
  coordsObjectStrings: loadFixture("coords-object-strings"),
  coordsObjectVariants: loadFixture("coords-object-variants"),
  coordsPairsStrings: loadFixture("coords-pairs-strings"),
  coordsMixed: loadFixture("coords-mixed"),
  ambiguousLatLon: loadFixture("ambiguous-latlon"),
  latLonSwapped: loadFixture("latlon-swapped"),
  invalidRange: loadFixture("invalid-range"),
  schemaChanged: loadFixture("schema-changed"),
  emptyArray: loadFixture("empty-array"),
  missingFields: loadFixture("missing-fields"),
  bowtie: loadFixture("bowtie"),
  antimeridian: loadFixture("antimeridian"),
  itemGeometryHint: loadFixture("item-geometryHint"),
  itemGeometry: loadFixture("item-geometry"),
  itemGeojson: loadFixture("item-geojson"),
  itemShape: loadFixture("item-shape"),
  itemArea: loadFixture("item-area"),
  itemMultiFieldPrefer: loadFixture("item-multi-field-prefer"),
  itemMultiFieldFallback: loadFixture("item-multi-field-fallback"),
};

const edgeCasesFixture = JSON.parse(readFileSync(SAMPLE_FIXTURE_PATH, "utf8")) as {
  items: Array<Record<string, unknown>>;
};
const contractFixture = JSON.parse(readFileSync(CONTRACT_FIXTURE_PATH, "utf8")) as {
  items: Array<Record<string, unknown>>;
};

const expectFinitePoint = (point: [number, number]) => {
  expect(Number.isFinite(point[0])).toBe(true);
  expect(Number.isFinite(point[1])).toBe(true);
};

const expectFiniteRing = (ring: [number, number][]) => {
  for (const point of ring) {
    expectFinitePoint(point);
  }
  expect(ring[0]).toEqual(ring[ring.length - 1]);
};

const expectFinitePolygon = (polygon: [number, number][][]) => {
  for (const ring of polygon) {
    expectFiniteRing(ring);
  }
};

const expectFiniteMultiPolygon = (multiPolygon: [number, number][][][]) => {
  for (const polygon of multiPolygon) {
    expectFinitePolygon(polygon);
  }
};

describe("parseGeometryHint (strict formats)", () => {
  type GeometryHintCase = {
    name: string;
    input: unknown;
    expectedKind: "circle" | "polygon";
    expectedRadiusMeters?: number;
  };

  const cases: GeometryHintCase[] = [
    {
      name: "legacy circle geometryHint",
      input: fixtures.legacyCircle,
      expectedKind: "circle",
    },
    {
      name: "circle radius in NM string",
      input: fixtures.circleRadiusNmString,
      expectedKind: "circle",
      expectedRadiusMeters: 9260,
    },
    {
      name: "legacy polygon geometryHint",
      input: fixtures.legacyPolygon,
      expectedKind: "polygon",
    },
  ];

  for (const testCase of cases) {
    it(`parses ${testCase.name}`, () => {
      expect(() => parseGeometryHint(testCase.input)).not.toThrow();
      const result = parseGeometryHint(testCase.input);

      expect(result.geometry?.kind).toBe(testCase.expectedKind);
      if (result.geometry?.kind === "circle") {
        expectFinitePoint(result.geometry.center);
        expect(Number.isFinite(result.geometry.radiusMeters)).toBe(true);
        if (testCase.expectedRadiusMeters) {
          expect(Math.round(result.geometry.radiusMeters)).toBe(testCase.expectedRadiusMeters);
        }
      }
      if (result.geometry?.kind === "polygon") {
        expectFinitePolygon(result.geometry.rings);
      }
    });
  }
});

describe("parseNotamGeometryWithReason (edge cases)", () => {
  type GeometryCase = {
    name: string;
    input: unknown;
    expectedKind: "circle" | "polygon" | "multiPolygon" | null;
    expectedRings?: number;
    expectedFirstCoord?: [number, number];
    expectedReason?: string;
  };

  const cases: GeometryCase[] = [
    {
      name: "GeoJSON polygon",
      input: fixtures.geojsonPolygon,
      expectedKind: "polygon",
    },
    {
      name: "GeoJSON feature polygon",
      input: fixtures.geojsonFeaturePolygon,
      expectedKind: "polygon",
    },
    {
      name: "GeoJSON feature collection",
      input: fixtures.geojsonFeatureCollection,
      expectedKind: "polygon",
    },
    {
      name: "GeoJSON multipolygon",
      input: fixtures.geojsonMultiPolygon,
      expectedKind: "multiPolygon",
    },
    {
      name: "GeoJSON polygon with holes",
      input: fixtures.geojsonPolygonHoles,
      expectedKind: "polygon",
      expectedRings: 2,
    },
    {
      name: "coordinate objects with numeric strings",
      input: fixtures.coordsObjectStrings,
      expectedKind: "polygon",
    },
    {
      name: "coordinate objects with lng/lon variants",
      input: fixtures.coordsObjectVariants,
      expectedKind: "polygon",
    },
    {
      name: "coordinate pairs as strings",
      input: fixtures.coordsPairsStrings,
      expectedKind: "polygon",
    },
    {
      name: "mixed numeric + string pairs",
      input: fixtures.coordsMixed,
      expectedKind: "polygon",
    },
    {
      name: "lat/lon swapped pairs",
      input: fixtures.latLonSwapped,
      expectedKind: "polygon",
      expectedFirstCoord: [124.74, 59.43],
    },
    {
      name: "ambiguous lat/lon pairs remain unchanged",
      input: fixtures.ambiguousLatLon,
      expectedKind: "polygon",
      expectedFirstCoord: [59.43, 24.74],
    },
    {
      name: "self-intersecting polygon",
      input: fixtures.bowtie,
      expectedKind: "polygon",
    },
    {
      name: "anti-meridian crossing polygon",
      input: fixtures.antimeridian,
      expectedKind: "multiPolygon",
    },
    {
      name: "invalid ranges",
      input: fixtures.invalidRange,
      expectedKind: null,
      expectedReason: "INVALID_COORDS",
    },
    {
      name: "schema changed format",
      input: fixtures.schemaChanged,
      expectedKind: null,
      expectedReason: "UNSUPPORTED_FORMAT",
    },
    {
      name: "empty coordinates",
      input: fixtures.emptyArray,
      expectedKind: null,
      expectedReason: "INVALID_COORDS",
    },
    {
      name: "missing required fields",
      input: fixtures.missingFields,
      expectedKind: null,
      expectedReason: "INVALID_COORDS",
    },
  ];

  for (const testCase of cases) {
    it(`handles ${testCase.name}`, () => {
      expect(() => parseNotamGeometryWithReason(testCase.input)).not.toThrow();
      const result = parseNotamGeometryWithReason(testCase.input);

      if (testCase.expectedKind === null) {
        expect(result.geometry).toBeNull();
        if (testCase.expectedReason) {
          expect(result.reason).toBe(testCase.expectedReason);
        }
        return;
      }

      expect(result.geometry?.kind).toBe(testCase.expectedKind);
      if (result.geometry?.kind === "circle") {
        expectFinitePoint(result.geometry.center);
        expect(Number.isFinite(result.geometry.radiusMeters)).toBe(true);
      }
      if (result.geometry?.kind === "polygon") {
        if (testCase.expectedRings) {
          expect(result.geometry.rings).toHaveLength(testCase.expectedRings);
        }
        expectFinitePolygon(result.geometry.rings);
        if (testCase.expectedFirstCoord) {
          expect(result.geometry.rings[0][0]).toEqual(testCase.expectedFirstCoord);
        }
      }
      if (result.geometry?.kind === "multiPolygon") {
        expectFiniteMultiPolygon(result.geometry.polygons);
        if (testCase.name === "anti-meridian crossing polygon") {
          expect(result.geometry.polygons).toHaveLength(2);
        }
      }
    });
  }
});

describe("normalizeNotamItem geometry extraction", () => {
  const cases = [
    {
      name: "geometryHint field",
      input: fixtures.itemGeometryHint,
      expectedKind: "circle",
    },
    {
      name: "geometry field",
      input: fixtures.itemGeometry,
      expectedKind: "polygon",
    },
    {
      name: "geojson field",
      input: fixtures.itemGeojson,
      expectedKind: "polygon",
    },
    {
      name: "shape field",
      input: fixtures.itemShape,
      expectedKind: "polygon",
    },
    {
      name: "area field",
      input: fixtures.itemArea,
      expectedKind: "polygon",
    },
    {
      name: "prefers geometryHint when multiple exist",
      input: fixtures.itemMultiFieldPrefer,
      expectedKind: "circle",
    },
    {
      name: "falls back when higher-priority field is invalid",
      input: fixtures.itemMultiFieldFallback,
      expectedKind: "polygon",
    },
  ] as const;

  for (const testCase of cases) {
    it(`normalizes ${testCase.name}`, () => {
      expect(() => normalizeNotamItem(testCase.input, EVENT_TIME)).not.toThrow();
      const normalized = normalizeNotamItem(testCase.input, EVENT_TIME);

      expect(normalized).not.toBeNull();
      expect(normalized?.geometry?.kind).toBe(testCase.expectedKind);
    });
  }

  it("returns null geometry with NO_CANDIDATE when no geometry fields exist", () => {
    const normalized = normalizeNotamItem(
      {
        id: "A0008/25",
        text: "NOTAM WITHOUT GEOMETRY",
      },
      EVENT_TIME,
    );

    expect(normalized?.geometry).toBeNull();
    expect(normalized?.geometryParseReason).toBe("NO_CANDIDATE");
  });

  it("captures unsupported format details on normalization", () => {
    const normalized = normalizeNotamItem(
      {
        id: "A0009/25",
        text: "NOTAM WITH UNKNOWN GEOMETRY",
        geometry: { shape: { kind: "unknown" } },
      },
      EVENT_TIME,
    );

    expect(normalized?.geometry).toBeNull();
    expect(normalized?.geometryParseReason).toBe("UNSUPPORTED_FORMAT");
    expect(normalized?.geometryParseDetails).toBeDefined();
    expect(normalized?.geometryParseDetails?.presentFields).toBeDefined();
  });

  it("closes inner hole ring when missing closure", () => {
    const polygonWithOpenHole = {
      type: "Polygon",
      coordinates: [
        [
          [24.74, 59.43],
          [24.76, 59.43],
          [24.76, 59.44],
          [24.74, 59.44],
          [24.74, 59.43],
        ],
        [
          [24.745, 59.435],
          [24.755, 59.435],
          [24.755, 59.439],
          [24.745, 59.439],
        ],
      ],
    };

    const result = parseNotamGeometryWithReason(polygonWithOpenHole);
    expect(result.geometry?.kind).toBe("polygon");
    if (result.geometry?.kind === "polygon") {
      const hole = result.geometry.rings[1];
      expect(hole[0]).toEqual(hole[hole.length - 1]);
    }
  });

  it("removes consecutive duplicate points in rings", () => {
    const polygonWithDuplicates = {
      type: "Polygon",
      coordinates: [
        [
          [24.74, 59.43],
          [24.74, 59.43],
          [24.76, 59.43],
          [24.76, 59.44],
          [24.74, 59.44],
          [24.74, 59.43],
        ],
      ],
    };

    const result = parseNotamGeometryWithReason(polygonWithDuplicates);
    expect(result.geometry?.kind).toBe("polygon");
    if (result.geometry?.kind === "polygon") {
      const ring = result.geometry.rings[0];
      expect(ring).toHaveLength(5);
    }
  });
});

describe("geometry edge case fixtures", () => {
  const notams = normalizeNotams(edgeCasesFixture, EVENT_TIME);

  const getNotamById = (id: string) => notams.find((notam) => notam.id === id);

  const computeLonSpan = (ring: [number, number][]) => {
    const longitudes = ring.map((coord) => coord[0]);
    return Math.max(...longitudes) - Math.min(...longitudes);
  };

  it("preserves hole rings with closure", () => {
    const notam = getNotamById("EDGE-HOLE");
    expect(notam?.geometry?.kind).toBe("polygon");
    if (notam?.geometry?.kind === "polygon") {
      expect(notam.geometry.rings).toHaveLength(2);
      for (const ring of notam.geometry.rings) {
        expect(ring[0]).toEqual(ring[ring.length - 1]);
      }
    }
  });

  it("splits anti-meridian polygons into sane spans", () => {
    const notam = getNotamById("EDGE-DATELINE");
    expect(notam?.geometry?.kind).toBe("multiPolygon");
    if (notam?.geometry?.kind === "multiPolygon") {
      expect(notam.geometry.polygons).toHaveLength(2);
      for (const polygon of notam.geometry.polygons) {
        for (const ring of polygon) {
          expect(computeLonSpan(ring)).toBeLessThanOrEqual(180);
        }
      }
    }
  });

  it("preserves holes when splitting dateline polygons", () => {
    const notam = getNotamById("EDGE-DATELINE-HOLE");
    expect(notam?.geometry?.kind).toBe("multiPolygon");
    if (notam?.geometry?.kind === "multiPolygon") {
      const polygonsWithHoles = notam.geometry.polygons.filter((polygon) => polygon.length > 1);
      expect(polygonsWithHoles.length).toBeGreaterThan(0);
      for (const polygon of notam.geometry.polygons) {
        for (const ring of polygon) {
          expect(ring[0]).toEqual(ring[ring.length - 1]);
          expect(computeLonSpan(ring)).toBeLessThanOrEqual(180);
        }
      }
    }
  });

  it("handles nested Feature geometry without throwing", () => {
    const notam = getNotamById("EDGE-NESTED");
    expect(notam?.geometry?.kind).toBe("polygon");
    if (notam?.geometry?.kind === "polygon") {
      expect(notam.geometry.rings).toHaveLength(1);
    }
  });
});

describe("NOTAM geometry contract fixture", () => {
  const results = contractFixture.items.map((item) => parseNotamGeometryWithReason(item));

  it("returns GeometryParseResult for every item", () => {
    for (const result of results) {
      expect(result).toHaveProperty("geometry");
      if (!result.geometry) {
        expect(result.reason).toBeDefined();
      }
    }
  });

  it("matches expected geometry types and reasons", () => {
    const expected = [
      { id: "CONTRACT-CIRCLE", kind: "circle" },
      { id: "CONTRACT-POLY", kind: "polygon" },
      { id: "CONTRACT-MULTI", kind: "multiPolygon" },
      { id: "CONTRACT-OBJECT-COORDS", kind: "polygon" },
      { id: "CONTRACT-SCHEMA-DRIFT", reason: "UNSUPPORTED_FORMAT" },
      { id: "CONTRACT-INVALID", reason: "INVALID_COORDS" },
    ] as const;

    expected.forEach((expectation, index) => {
      const result = results[index];
      if ("kind" in expectation) {
        expect(result.geometry?.kind).toBe(expectation.kind);
      } else {
        expect(result.geometry).toBeNull();
        expect(result.reason).toBe(expectation.reason);
      }
    });
  });

  it("enforces minimum parse success rate", () => {
    const expectedFailures = new Set(["CONTRACT-SCHEMA-DRIFT", "CONTRACT-INVALID"]);
    const summary = contractFixture.items
      .map((item) => normalizeNotamItem(item, EVENT_TIME))
      .reduce(
        (acc, notam) => {
          acc.total += 1;
          if (notam?.geometry) {
            acc.success += 1;
          } else if (notam?.geometryParseReason) {
            acc.byReason[notam.geometryParseReason] =
              (acc.byReason[notam.geometryParseReason] ?? 0) + 1;
          }
          return acc;
        },
        { total: 0, success: 0, byReason: {} as Record<string, number> },
      );

    const adjustedTotal = summary.total - expectedFailures.size;
    const successRate = adjustedTotal > 0 ? summary.success / adjustedTotal : 0;
    expect(
      successRate,
      `Parse success ${summary.success}/${adjustedTotal} byReason=${JSON.stringify(summary.byReason)}`,
    ).toBeGreaterThanOrEqual(0.9);
  });
});
