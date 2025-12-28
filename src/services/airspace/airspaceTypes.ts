import type { NotamGeometry, NormalizedNotam } from "../notam/notamTypes";

// Define the shared AirspaceFeature type
export interface AirspaceCoordinate {
  lat: number;
  lon: number;
}

export type AirspaceGeometry =
  | { type: "Polygon"; coordinates: [number, number][][] }
  | { type: "MultiPolygon"; coordinates: [number, number][][][] }
  | { type: "Point"; coordinates: [number, number] }
  | { type: "MultiPoint"; coordinates: [number, number][] }
  | { type: "LineString"; coordinates: [number, number][] };

export interface ParserInfo {
  version: string;
  source: 'html' | 'geojson';
}

export interface AirspaceProperties {
  designator: string;
  name?: string;
  upperLimit: string;
  lowerLimit: string;
  remarks?: string;
  sourceUrl?: string;
  effectiveDate?: string;
  parserInfo?: ParserInfo;
}

export interface AirspaceFeature {
  type: string;
  geometry: AirspaceGeometry;
  properties: AirspaceProperties;
}

/**
 * Enhanced NOTAM with additional geometry information
 */
export interface EnhancedNotam extends NormalizedNotam {
  /** Enhanced geometry from eAIP data when available */
  enhancedGeometry: NotamGeometry | null;
  /** Original geometry from NOTAM parsing */
  sourceGeometry: NotamGeometry | null;
  /** Original geometry source before enhancement */
  sourceGeometrySource?: "html" | "geojson" | "notamText" | "none";
  /** Issues with geometry parsing or enhancement */
  issues: string[];
}