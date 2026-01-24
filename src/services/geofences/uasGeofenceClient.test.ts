import { describe, expect, it, vi } from "vitest";

import { fromLonLat } from "ol/proj";

import { fetchUasGeofencesWithFallback, parseUasGeofences } from "./uasGeofenceClient";

vi.mock("@/services/http/apiClient", () => ({
  getJson: vi.fn(),
}));

import { getJson } from "@/services/http/apiClient";

const sampleGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "area-a",
      properties: {
        name: "Area A",
        description: "First zone",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [24.7, 59.4],
            [24.8, 59.4],
            [24.8, 59.5],
            [24.7, 59.5],
            [24.7, 59.4],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        title: "Area B",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [25.0, 59.3],
              [25.1, 59.3],
              [25.1, 59.4],
              [25.0, 59.4],
              [25.0, 59.3],
            ],
          ],
          [
            [
              [25.2, 59.35],
              [25.3, 59.35],
              [25.3, 59.45],
              [25.2, 59.45],
              [25.2, 59.35],
            ],
          ],
        ],
      },
    },
  ],
};

describe("parseUasGeofences", () => {
  it("creates geofences for polygon and multipolygon features", () => {
    const geofences = parseUasGeofences(sampleGeoJson, "2025-01-01T00:00:00Z");

    expect(geofences).toHaveLength(3);
    expect(geofences[0]).toMatchObject({
      id: "uas-area-a",
      name: "Area A",
      description: "First zone",
      geometry: {
        kind: "polygon",
      },
      createdAtUtc: "2025-01-01T00:00:00Z",
    });

    expect(geofences[1].id).toBe("uas-area-b-1");
    expect(geofences[1].name).toBe("Area B (1)");
    expect(geofences[2].id).toBe("uas-area-b-2");
    expect(geofences[2].name).toBe("Area B (2)");
    expect(geofences[1].geometry.kind).toBe("polygon");
  });

  it("closes polygon rings when missing the final coordinate", () => {
    const openRingGeoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Open Ring" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [24.7, 59.4],
                [24.8, 59.4],
                [24.8, 59.5],
                [24.7, 59.5],
              ],
            ],
          },
        },
      ],
    };

    const geofences = parseUasGeofences(openRingGeoJson, "2025-01-01T00:00:00Z");
    const ring = geofences[0].geometry.kind === "polygon" ? geofences[0].geometry.coordinates[0] : [];

    expect(ring).toHaveLength(5);
    expect(ring[0]).toEqual(ring[ring.length - 1]);
  });

  it("swaps lat/lon when coordinates look reversed for Estonia", () => {
    const swappedGeoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Swapped" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [59.4, 24.7],
                [59.5, 24.7],
                [59.5, 24.8],
                [59.4, 24.8],
                [59.4, 24.7],
              ],
            ],
          },
        },
      ],
    };

    const geofences = parseUasGeofences(swappedGeoJson, "2025-01-01T00:00:00Z");
    const ring = geofences[0].geometry.kind === "polygon" ? geofences[0].geometry.coordinates[0] : [];

    expect(ring[0]).toEqual([24.7, 59.4]);
  });

  it("converts Web Mercator coordinates to lon/lat", () => {
    const first = fromLonLat([24.75, 59.44]);
    const second = fromLonLat([24.76, 59.44]);
    const third = fromLonLat([24.76, 59.45]);
    const fourth = fromLonLat([24.75, 59.45]);

    const webMercatorGeoJson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Web Mercator" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [first[0], first[1]],
                [second[0], second[1]],
                [third[0], third[1]],
                [fourth[0], fourth[1]],
                [first[0], first[1]],
              ],
            ],
          },
        },
      ],
    };

    const geofences = parseUasGeofences(webMercatorGeoJson, "2025-01-01T00:00:00Z");
    const ring = geofences[0].geometry.kind === "polygon" ? geofences[0].geometry.coordinates[0] : [];

    expect(ring[0][0]).toBeCloseTo(24.75, 3);
    expect(ring[0][1]).toBeCloseTo(59.44, 3);
  });
});

describe("fetchUasGeofencesWithFallback", () => {
  it("uses fallback when primary fetch fails", async () => {
    const mockedGetJson = vi.mocked(getJson);
    mockedGetJson
      .mockRejectedValueOnce(new Error("primary failed"))
      .mockResolvedValueOnce(sampleGeoJson);

    const geofences = await fetchUasGeofencesWithFallback({
      primaryUrl: "https://example.com/primary.geojson",
      fallbackUrl: "/mock/uas.geojson",
    });

    expect(geofences).toHaveLength(3);
    expect(mockedGetJson).toHaveBeenCalledTimes(2);
    expect(mockedGetJson).toHaveBeenNthCalledWith(1, "https://example.com/primary.geojson", { signal: undefined });
    expect(mockedGetJson).toHaveBeenNthCalledWith(2, "/mock/uas.geojson", { signal: undefined });
  });
});
