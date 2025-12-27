import { describe, expect, it } from "vitest";
import { parseDmsLatLonPair, parseCoordinateChain, normalizeCoordinate } from "./coordParsers";

describe("coordParsers", () => {
  describe("parseDmsLatLonPair", () => {
    it("parses coordinate in format DDMMSSN DDDMMSSEx", () => {
      const result = parseDmsLatLonPair("591633N 0261500E");
      expect(result).toEqual([26.25, 59.27583333333333]); // 26°15'00" E, 59°16'33" N
    });

    it("parses coordinate without space between lat and lon", () => {
      const result = parseDmsLatLonPair("591633N0261500E");
      expect(result).toEqual([26.25, 59.27583333333333]); // 26°15'00" E, 59°16'33" N
    });

    it("handles West longitude correctly (negative)", () => {
      const result = parseDmsLatLonPair("584514N 0243658W");
      expect(result[0]).toBeCloseTo(-24.61611111111111, 10); // West should be negative
      expect(result[1]).toBeCloseTo(58.75388888888889, 10);
    });

    it("handles South latitude correctly (negative)", () => {
      const result = parseDmsLatLonPair("551633S 0261500E");
      expect(result[0]).toBeCloseTo(26.25, 10);
      expect(result[1]).toBeCloseTo(-55.27583333333333, 10); // South should be negative
    });

    it("returns null for invalid format", () => {
      const result = parseDmsLatLonPair("invalid coordinate");
      expect(result).toBeNull();
    });

    it("returns null for incomplete coordinate", () => {
      const result = parseDmsLatLonPair("591633N"); // Missing longitude
      expect(result).toBeNull();
    });
  });

  describe("parseCoordinateChain", () => {
    it("parses coordinate chain with multiple points", () => {
      const result = parseCoordinateChain("591633N 0261500E - 591639N 0255647E - 591614N 0254748E");
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([26.25, 59.27583333333333]); // First point
      expect(result[1][0]).toBeCloseTo(25.94638888888889, 10); // Second point longitude
      expect(result[1][1]).toBeCloseTo(59.2775, 10); // Second point latitude
      expect(result[2][0]).toBeCloseTo(25.79666666666666, 10); // Third point longitude
      expect(result[2][1]).toBeCloseTo(59.27055555555555, 10); // Third point latitude
    });

    it("parses coordinate chain without spaces between coordinates", () => {
      const result = parseCoordinateChain("591633N0261500E - 591639N0255647E");
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([26.25, 59.27583333333333]);
      expect(result[1][0]).toBeCloseTo(25.94638888888889, 10);
      expect(result[1][1]).toBeCloseTo(59.2775, 10);
    });

    it("returns null for invalid coordinate in chain", () => {
      const result = parseCoordinateChain("591633N 0261500E - invalid - 591614N 0254748E");
      expect(result).toBeNull();
    });

    it("returns null for completely invalid input", () => {
      const result = parseCoordinateChain("invalid input");
      expect(result).toBeNull();
    });
  });

  describe("normalizeCoordinate", () => {
    it("normalizes array coordinate [lon, lat]", () => {
      const result = normalizeCoordinate([24.75, 59.43]);
      expect(result).toEqual([24.75, 59.43]);
    });

    it("normalizes array coordinate [lat, lon] when lat is <= 90 and lon > 90", () => {
      const result = normalizeCoordinate([59.43, 124.75]); // lat, lon format where lon > 90
      expect(result[0]).toBeCloseTo(124.75, 10); // Should swap to lon, lat
      expect(result[1]).toBeCloseTo(59.43, 10); // Should swap to lon, lat
    });

    it("normalizes object coordinate with lat/lon properties", () => {
      const result = normalizeCoordinate({ lat: 59.43, lon: 24.75 });
      expect(result).toEqual([24.75, 59.43]);
    });

    it("normalizes object coordinate with latitude/longitude properties", () => {
      const result = normalizeCoordinate({ latitude: 59.43, longitude: 24.75 });
      expect(result).toEqual([24.75, 59.43]);
    });

    it("normalizes object coordinate with x/y properties", () => {
      const result = normalizeCoordinate({ y: 59.43, x: 24.75 });
      expect(result).toEqual([24.75, 59.43]);
    });

    it("returns null for invalid coordinate", () => {
      const result = normalizeCoordinate({ lat: "invalid", lon: "invalid" });
      expect(result).toBeNull();
    });

    it("returns null for coordinate out of range", () => {
      const result = normalizeCoordinate([200, 59.43]); // Longitude out of range
      expect(result).toBeNull();
    });
  });
});