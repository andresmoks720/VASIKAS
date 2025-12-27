import type { NotamGeometry, NormalizedNotam } from "../notam/notamTypes";

// Define the shared AirspaceFeature type
export interface AirspaceCoordinate {
  lat: number;
  lon: number;
}

export interface AirspaceGeometry {
  type: string;
  coordinates: number[][][]; // [lon, lat] pairs for polygon rings
}

export interface AirspaceProperties {
  designator: string;
  name?: string;
  upperLimit: string;
  lowerLimit: string;
  remarks?: string;
  sourceUrl: string;
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
  /** Source of the primary geometry ('eAIP', 'parsed', or 'none') */
  geometrySource: 'eAIP' | 'parsed' | 'none';
  /** Issues with geometry parsing or enhancement */
  issues: string[];
}