import { describe, expect, it } from "vitest";
import { HTML_PARSER_VERSION } from "../src/services/airspace/runtimeHtmlParser";
import { GEOJSON_LOADER_VERSION } from "../src/services/airspace/airspaceLoader";

describe("airspaceParity", () => {
  it("ensures version constants are properly defined", () => {
    // Verify that version constants are properly defined
    expect(HTML_PARSER_VERSION).toBeDefined();
    expect(GEOJSON_LOADER_VERSION).toBeDefined();

    // Verify that version constants are in semantic version format
    expect(typeof HTML_PARSER_VERSION).toBe("string");
    expect(typeof GEOJSON_LOADER_VERSION).toBe("string");

    // Verify that version strings follow semantic versioning pattern
    const semverRegex = /^\d+\.\d+\.\d+$/;
    expect(HTML_PARSER_VERSION).toMatch(semverRegex);
    expect(GEOJSON_LOADER_VERSION).toMatch(semverRegex);
  });
});