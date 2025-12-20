export type AltitudeRef = "AGL" | "MSL";
export type AltitudeSource = "detected" | "reported" | "unknown";

export type Altitude = {
  meters: number | null;
  ref: AltitudeRef;
  source: AltitudeSource;
  comment?: string;
  rawText?: string;
};

export type LonLat = { lon: number; lat: number };

export type GeoJsonPolygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

export type GeofenceKind = "circle" | "polygon" | "notam_area";
export type GeofenceSource = "user" | "notam" | "import";

export type Geofence = {
  id: string;
  name: string;
  kind: GeofenceKind;
  source: GeofenceSource;
  validFromUtc?: string;
  validToUtc?: string;
  center?: LonLat;
  radiusMeters?: number;
  polygon?: GeoJsonPolygon;
  meta?: Record<string, unknown>;
};
