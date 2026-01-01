import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
    parseNotamGeometry,
} from "./notamInterpreter";
import {
    parseAltitudesFromText,
} from "./altitude/altitudeParser";
import {
    parseGeometryHint,
    parseNotamGeometryWithReason,
} from "./geometry/geometryParsers";
import {
    countNotamItems,
    normalizeNotams,
} from "./notamNormalizer";

const NOW_UTC = "2025-12-18T12:00:00Z";
const FIXTURE_PATH = resolve(process.cwd(), "test/fixtures/area24.sample.json");
const FIXTURE = JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as {
    items: Array<Record<string, unknown>>;
};

describe("parseAltitudesFromText", () => {
    it("parses SFC as 0m AGL", () => {
        const altitudes = parseAltitudesFromText("RESTRICTED AREA SFC TO 3000FT");
        const sfc = altitudes.find((a) => a.rawText === "SFC");

        expect(sfc).toBeDefined();
        expect(sfc?.meters).toBe(0);
        expect(sfc?.ref).toBe("AGL");
        expect(sfc?.source).toBe("reported");
        expect(sfc?.comment).toBe("SFC from NOTAM");
    });

    it("parses GND as 0m AGL", () => {
        const altitudes = parseAltitudesFromText("FROM GND TO 500FT AGL");
        const gnd = altitudes.find((a) => a.rawText === "GND");

        expect(gnd).toBeDefined();
        expect(gnd?.meters).toBe(0);
        expect(gnd?.ref).toBe("AGL");
        expect(gnd?.comment).toBe("GND from NOTAM");
    });

    it("parses FT AMSL correctly", () => {
        const altitudes = parseAltitudesFromText("SFC TO 3000FT AMSL");
        const amsl = altitudes.find((a) => a.rawText === "3000FT AMSL");

        expect(amsl).toBeDefined();
        expect(amsl?.meters).toBe(914); // 3000 * 0.3048 ≈ 914
        expect(amsl?.ref).toBe("MSL");
        expect(amsl?.source).toBe("reported");
        expect(amsl?.comment).toContain("3000FT AMSL");
    });

    it("parses FT MSL variant", () => {
        const altitudes = parseAltitudesFromText("UP TO 5000 FT MSL");
        const msl = altitudes.find((a) => a.ref === "MSL" && a.meters !== null && a.meters > 0);

        expect(msl).toBeDefined();
        expect(msl?.meters).toBe(1524); // 5000 * 0.3048
        expect(msl?.comment).toMatch(/from NOTAM/);
    });

    it("parses FT AGL correctly", () => {
        const altitudes = parseAltitudesFromText("DRONE EXERCISE 500FT AGL");
        const agl = altitudes.find((a) => a.rawText === "500FT AGL");

        expect(agl).toBeDefined();
        expect(agl?.meters).toBe(152); // 500 * 0.3048 ≈ 152
        expect(agl?.ref).toBe("AGL");
        expect(agl?.comment).toContain("500FT AGL");
    });

    it("parses FL (Flight Level)", () => {
        const altitudes = parseAltitudesFromText("AIRSPACE FL100 TO FL350");
        const fl100 = altitudes.find((a) => a.rawText === "FL100");
        const fl350 = altitudes.find((a) => a.rawText === "FL350");

        expect(fl100).toBeDefined();
        expect(fl100?.meters).toBe(3048); // FL100 = 10000ft
        expect(fl100?.ref).toBe("MSL");

        expect(fl350).toBeDefined();
        expect(fl350?.meters).toBe(10668); // FL350 = 35000ft
    });

    it("always includes comment", () => {
        const altitudes = parseAltitudesFromText("SFC TO 3000FT AMSL AND 500FT AGL");

        for (const alt of altitudes) {
            expect(alt.comment).toBeDefined();
            expect(alt.comment!.length).toBeGreaterThan(0);
        }
    });

    it("deduplicates identical altitudes", () => {
        const altitudes = parseAltitudesFromText("SFC TO SFC FROM SFC");

        const sfcCount = altitudes.filter((a) => a.rawText === "SFC").length;
        expect(sfcCount).toBe(1);
    });

    it("returns empty array for text without altitudes", () => {
        const altitudes = parseAltitudesFromText("NO ALTITUDE INFO HERE");
        expect(altitudes).toEqual([]);
    });
});

describe("parseGeometryHint", () => {
    it("parses circle geometry", () => {
        const result = parseGeometryHint({
            type: "circle",
            center: { lon: 24.7536, lat: 59.4369 },
            radiusMeters: 1000,
        });

        expect(result.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 1000,
        });
    });

    it("normalizes circle radius units from numeric and string inputs", () => {
        const numericKm = parseGeometryHint({
            type: "circle",
            center: { lon: 24.7536, lat: 59.4369 },
            radiusKm: 5,
        });

        const stringKm = parseGeometryHint({
            type: "circle",
            center: { lon: 24.7536, lat: 59.4369 },
            radiusKm: "5 km",
        });

        const stringNm = parseGeometryHint({
            type: "circle",
            center: { lon: 24.7536, lat: 59.4369 },
            radiusNm: "2 nm",
        });

        expect(numericKm.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 5000,
        });
        expect(stringKm.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 5000,
        });
        expect(stringNm.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 3704,
        });
    });

    it("parses polygon geometry", () => {
        const result = parseGeometryHint({
            type: "polygon",
            coordinates: [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                [24.74, 59.43],
            ],
        });

        expect(result.geometry).toEqual({
            kind: "polygon",
            rings: [
                [
                    [24.74, 59.43],
                    [24.76, 59.43],
                    [24.76, 59.44],
                    [24.74, 59.44],
                    [24.74, 59.43],
                ],
            ],
        });
    });

    it("closes unclosed polygon ring", () => {
        const result = parseGeometryHint({
            type: "polygon",
            coordinates: [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                // Missing closing point
            ],
        });

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            const ring = result.geometry.rings[0];
            const first = ring[0];
            const last = ring[ring.length - 1];
            expect(first).toEqual(last);
        }
    });

    it("returns null for invalid geometry", () => {
        expect(parseGeometryHint(null).geometry).toBeNull();
        expect(parseGeometryHint(undefined).geometry).toBeNull();
        expect(parseGeometryHint({ type: "unknown" }).geometry).toBeNull();
        expect(parseGeometryHint({ type: "circle" }).geometry).toBeNull(); // Missing center/radius
    });

    it("returns null for polygon with too few points", () => {
        const result = parseGeometryHint({
            type: "polygon",
            coordinates: [[24.74, 59.43], [24.76, 59.43]], // Only 2 points
        });

        expect(result.geometry).toBeNull();
    });
});

describe("parseNotamGeometry", () => {
    const [legacyCircle, geoJsonPolygonFeature, geoJsonMultiPolygonFeature] = FIXTURE.items;

    it("parses root-level circle fields", () => {
        const result = parseNotamGeometry({
            lat: 59.4369,
            lon: 24.7536,
            radius: 1200,
        });

        expect(result.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 1200,
        });
    });

    it("parses GeoJSON polygon geometry", () => {
        const result = parseNotamGeometry({
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [24.74, 59.43],
                        [24.76, 59.43],
                        [24.76, 59.44],
                        [24.74, 59.44],
                        [24.74, 59.43],
                    ],
                ],
            },
        });

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            expect(result.geometry.rings[0]).toHaveLength(5);
        }
    });

    it("preserves rings for GeoJSON polygon with holes", () => {
        const result = parseNotamGeometry({
            geometry: {
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
                        [24.745, 59.435],
                    ],
                ],
            },
        });

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            const expectedOuterRing: [number, number][] = [
                [24.74, 59.43],
                [24.76, 59.43],
                [24.76, 59.44],
                [24.74, 59.44],
                [24.74, 59.43],
            ];
            const expectedInnerRing: [number, number][] = [
                [24.745, 59.435],
                [24.755, 59.435],
                [24.755, 59.439],
                [24.745, 59.439],
                [24.745, 59.435],
            ];

            const matchesRing = (ring: [number, number][], expected: [number, number][]) => {
                const forward = JSON.stringify(ring);
                const reversed = JSON.stringify([...ring].reverse());
                const expectedJson = JSON.stringify(expected);
                return forward === expectedJson || reversed === expectedJson;
            };

            expect(result.geometry.rings).toHaveLength(2);
            expect(matchesRing(result.geometry.rings[0], expectedOuterRing)).toBe(true);
            expect(matchesRing(result.geometry.rings[1], expectedInnerRing)).toBe(true);
        }
    });

    it("parses GeoJSON multipolygon preserving polygons and rings", () => {
        const result = parseNotamGeometry({
            geometry: {
                type: "MultiPolygon",
                coordinates: [
                    [
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
                            [24.745, 59.435],
                        ],
                    ],
                    [
                        [
                            [25.0, 60.0],
                            [25.1, 60.0],
                            [25.1, 60.1],
                            [25.0, 60.1],
                            [25.0, 60.0],
                        ],
                    ],
                ],
            },
        });

        expect(result.geometry?.kind).toBe("multiPolygon");
        if (result.geometry?.kind === "multiPolygon") {
            expect(result.geometry.polygons).toHaveLength(2);
            expect(result.geometry.polygons[0]).toEqual([
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
                    [24.745, 59.435],
                ],
            ]);
            expect(result.geometry.polygons[1]).toEqual([
                [
                    [25.0, 60.0],
                    [25.1, 60.0],
                    [25.1, 60.1],
                    [25.0, 60.1],
                    [25.0, 60.0],
                ],
            ]);
        }
    });

    it("parses circle variant with x/y center", () => {
        const result = parseNotamGeometry({
            circle: {
                center: { x: 24.7536, y: 59.4369 },
                radius: 1500,
            },
        });

        expect(result.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 1500,
        });
    });

    it("parses legacy geometryHint circle from fixture", () => {
        const result = parseNotamGeometry(legacyCircle);

        expect(result.geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 1000,
        });
    });

    it("parses GeoJSON polygon feature from fixture with ring closure", () => {
        const result = parseNotamGeometry(geoJsonPolygonFeature);

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            const ring = result.geometry.rings[0];
            expect(ring[0]).toEqual(ring[ring.length - 1]);
        }
    });

    it("parses GeoJSON multipolygon feature from fixture", () => {
        const result = parseNotamGeometry(geoJsonMultiPolygonFeature);

        expect(result.geometry?.kind).toBe("multiPolygon");
        if (result.geometry?.kind === "multiPolygon") {
            expect(result.geometry.polygons).toHaveLength(2);
        }
    });

    it("prefers GeoJSON geometry when polygon fallback also exists", () => {
        const result = parseNotamGeometry(geoJsonMultiPolygonFeature);

        expect(result.geometry?.kind).toBe("multiPolygon");
    });

    it("parses polygon with object coordinates and numeric strings", () => {
        const result = parseNotamGeometry(geoJsonMultiPolygonFeature?.polygon);

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            expect(result.geometry.rings[0][0]).toEqual([24.74, 59.43]);
            const ring = result.geometry.rings[0];
            expect(ring[0]).toEqual(ring[ring.length - 1]);
        }
    });

    it("swaps lat/lon for array coordinates when needed", () => {
        const result = parseNotamGeometry([
            [59.43, 124.74],
            [59.43, 124.76],
            [59.44, 124.76],
            [59.44, 124.74],
        ]);

        expect(result.geometry?.kind).toBe("polygon");
        if (result.geometry?.kind === "polygon") {
            expect(result.geometry.rings[0][0]).toEqual([124.74, 59.43]);
        }
    });

    it("returns invalid coords reason for bad geometry", () => {
        const result = parseNotamGeometryWithReason([[24.7]]);

        expect(result.geometry).toBeNull();
        expect(result.reason).toBe("INVALID_COORDS");
    });
});

describe("normalizeNotams", () => {
    const mockRaw = {
        generatedAtUtc: "2025-12-18T10:00:00Z",
        items: [
            {
                id: "A1234/25",
                text: "TEMP RESTRICTED AREA ... SFC TO 3000FT AMSL ...",
                validFromUtc: "2025-12-18T00:00:00Z",
                validToUtc: "2025-12-19T23:59:59Z",
                geometryHint: {
                    type: "circle",
                    center: { lon: 24.7536, lat: 59.4369 },
                    radiusMeters: 1000,
                },
            },
            {
                id: "B5678/25",
                text: "DRONE EXERCISE ... GND TO 500FT AGL ...",
                validFromUtc: "2025-12-18T08:00:00Z",
                validToUtc: "2025-12-18T16:00:00Z",
                geometryHint: {
                    type: "polygon",
                    coordinates: [
                        [24.74, 59.43],
                        [24.76, 59.43],
                        [24.76, 59.44],
                        [24.74, 59.44],
                        [24.74, 59.43],
                    ],
                },
            },
        ],
    };

    it("extracts IDs correctly", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams).toHaveLength(2);
        expect(notams[0].id).toBe("A1234/25");
        expect(notams[1].id).toBe("B5678/25");
    });

    it("extracts text and generates summary", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[0].text).toContain("TEMP RESTRICTED AREA");
        expect(notams[0].summary.length).toBeLessThanOrEqual(60);
    });

    it("extracts validity dates", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[0].validFromUtc).toBe("2025-12-18T00:00:00Z");
        expect(notams[0].validToUtc).toBe("2025-12-19T23:59:59Z");
    });

    it("uses generatedAtUtc for eventTimeUtc", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[0].eventTimeUtc).toBe("2025-12-18T10:00:00Z");
    });

    it("falls back to nowUtcIso when generatedAtUtc is missing", () => {
        const rawWithoutGenerated = { items: mockRaw.items };
        const notams = normalizeNotams(rawWithoutGenerated, NOW_UTC);

        expect(notams[0].eventTimeUtc).toBe(NOW_UTC);
    });

    it("parses altitudes correctly", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        // First NOTAM: SFC TO 3000FT AMSL
        const notam1Alts = notams[0].altitudes;
        expect(notam1Alts.length).toBeGreaterThanOrEqual(2);

        const sfc = notam1Alts.find((a) => a.meters === 0);
        expect(sfc).toBeDefined();
        expect(sfc?.comment).toBeDefined();

        const amsl = notam1Alts.find((a) => a.meters === 914);
        expect(amsl).toBeDefined();
        expect(amsl?.ref).toBe("MSL");

        // Second NOTAM: GND TO 500FT AGL
        const notam2Alts = notams[1].altitudes;
        const agl = notam2Alts.find((a) => a.meters === 152);
        expect(agl).toBeDefined();
        expect(agl?.ref).toBe("AGL");
    });

    it("ensures altitude.comment is always present", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        for (const notam of notams) {
            for (const alt of notam.altitudes) {
                expect(alt.comment).toBeDefined();
                expect(alt.comment!.length).toBeGreaterThan(0);
            }
        }
    });

    it("parses circle geometry from geometryHint", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[0].geometry).toEqual({
            kind: "circle",
            center: [24.7536, 59.4369],
            radiusMeters: 1000,
        });
    });

    it("parses polygon geometry from geometryHint", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[1].geometry?.kind).toBe("polygon");
        if (notams[1].geometry?.kind === "polygon") {
            expect(notams[1].geometry.rings).toHaveLength(1);
            expect(notams[1].geometry.rings[0]).toHaveLength(5);
        }
    });

    it("preserves raw payload for debugging", () => {
        const notams = normalizeNotams(mockRaw, NOW_UTC);

        expect(notams[0].raw).toEqual(mockRaw.items[0]);
        expect(notams[1].raw).toEqual(mockRaw.items[1]);
    });

    it("handles empty input gracefully", () => {
        expect(normalizeNotams(null, NOW_UTC)).toEqual([]);
        expect(normalizeNotams({}, NOW_UTC)).toEqual([]);
        expect(normalizeNotams({ items: [] }, NOW_UTC)).toEqual([]);
    });

    it("skips invalid items", () => {
        const rawWithInvalid = {
            items: [
                { id: "A1234/25", text: "Valid NOTAM" },
                { id: "Invalid" }, // Missing text
                { text: "Also invalid" }, // Missing id
                null,
                "not an object",
            ],
        };

        const notams = normalizeNotams(rawWithInvalid, NOW_UTC);
        expect(notams).toHaveLength(1);
        expect(notams[0].id).toBe("A1234/25");
    });
});

describe("countNotamItems", () => {
    it("counts items from mock payloads", () => {
        expect(countNotamItems({ items: [{}, {}] })).toBe(2);
    });

    it("counts items from live payloads", () => {
        expect(countNotamItems({ notams: [{}, {}, {}] })).toBe(3);
    });

    it("counts arrays directly and handles invalid payloads", () => {
        expect(countNotamItems([{}, {}])).toBe(2);
        expect(countNotamItems(null)).toBe(0);
    });
});
