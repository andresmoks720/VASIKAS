import { describe, expect, it } from "vitest";
import { parseAltitudesFromText } from "./altitudeParser";

describe("altitudeParser", () => {
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
});