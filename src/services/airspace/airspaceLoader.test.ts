import { afterEach, describe, expect, it, vi } from "vitest";

import { AirspaceLoader } from "./airspaceLoader";

describe("AirspaceLoader", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads latest airspace data using the manifest effective date", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ effectiveDate: "2025-12-25" }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Polygon",
                  coordinates: [[[24.7, 59.4], [24.8, 59.4], [24.8, 59.5], [24.7, 59.4]]],
                },
                properties: {
                  designator: "EER-TEST",
                  sourceUrl: "https://eaip.eans.ee/example",
                },
              },
            ],
            metadata: { example: true },
          }),
          { status: 200 },
        ),
      );

    vi.stubGlobal("fetch", fetchMock);

    const loader = new AirspaceLoader();
    const result = await loader.loadLatestAirspace();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, AirspaceLoader.LATEST_MANIFEST_URL);
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/data/airspace/ee/2025-12-25/enr5_1.geojson");
    expect(result.metadata?.latestManifest?.effectiveDate).toBe("2025-12-25");
  });

  it("throws when latest manifest is missing effectiveDate", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const loader = new AirspaceLoader();

    await expect(loader.loadLatestAirspace()).rejects.toThrow(
      "Invalid latest airspace manifest: missing effectiveDate",
    );
  });

  it("leaves absolute manifest URLs untouched", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ effectiveDate: "2025-12-25" }), { status: 200 }),
    ).mockResolvedValueOnce(
      new Response(JSON.stringify({ type: "FeatureCollection", features: [] }), { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const loader = new AirspaceLoader();
    await loader.loadLatestAirspace("https://example.com/airspace/latest.json");

    expect(fetchMock).toHaveBeenNthCalledWith(1, "https://example.com/airspace/latest.json");
  });

  it("leaves protocol-relative manifest URLs untouched", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ effectiveDate: "2025-12-25" }), { status: 200 }),
    ).mockResolvedValueOnce(
      new Response(JSON.stringify({ type: "FeatureCollection", features: [] }), { status: 200 }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const loader = new AirspaceLoader();
    await loader.loadLatestAirspace("//cdn.example.com/airspace/latest.json");

    expect(fetchMock).toHaveBeenNthCalledWith(1, "//cdn.example.com/airspace/latest.json");
  });
});
