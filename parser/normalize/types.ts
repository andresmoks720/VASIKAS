export type Position = [number, number];

export type PolygonGeometry = {
  type: "Polygon";
  coordinates: Position[][];
};

export type MultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: Position[][][];
};

export type PointGeometry = {
  type: "Point";
  coordinates: Position;
};

export type Geometry = PolygonGeometry | MultiPolygonGeometry | PointGeometry;

export type TimeWindow = {
  start: string;
  end: string;
  status?: "ACTIVE" | "INACTIVE";
  comment?: string;
};

export type TimeQuality = "EXACT" | "APPROX" | "PLACEHOLDER" | "UNKNOWN";

export type TimeInfo = {
  validFrom: string;
  validUntil: string;
  activations: TimeWindow[];
  quality: TimeQuality;
  original?: Record<string, unknown>;
};

export type VerticalRef = "SFC" | "AGL" | "AMSL" | "STD" | "UNKNOWN";

export type VerticalLimits = {
  lower_m: number;
  upper_m: number | null;
  lower_ref: VerticalRef;
  upper_ref: VerticalRef;
  original?: Record<string, unknown>;
};

export type LinkInfo = {
  relationType: "NEW" | "ACTIVATION" | "MODIFICATION" | "REPLACEMENT" | "CANCELLATION";
  relatedTo: string | null;
  supersedes: string[];
};

export type Provenance = {
  inputs: Array<{ source: "NOTAM" | "EAIP" | "AIP" | "UAS_ZONE" | "OTHER"; id: string }>;
};

export type DisplayInfo = {
  title?: string;
  summary?: string;
  content?: string;
  contact?: string;
};

export type RestrictionProperties = {
  category: "AIRSPACE" | "UAS_ZONE" | "OBSTACLE" | "PROCEDURE" | "INFO";
  restriction: "PROHIBITED" | "RESTRICTED" | "DANGER" | "REQ_AUTHORISATION" | "WARNING" | "INFORMATION";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  tags: string[];
  shape?: { type: "CIRCLE"; radius_m: number };
  vertical: VerticalLimits;
  time: TimeInfo;
  link: LinkInfo;
  provenance: Provenance;
  display?: DisplayInfo;
  labelPoint?: [number, number];
  bbox?: [number, number, number, number];
};

export type RestrictionFeature = {
  type: "Feature";
  id: string;
  geometry: Geometry;
  properties: RestrictionProperties;
};

export type RestrictionFeatureCollection = {
  type: "FeatureCollection";
  generatedAt: string;
  lookaheadDays: number;
  units: { distance: "m"; altitude: "m" };
  rounding: { distance_m: number; altitude_m: number };
  metadata: {
    parserVersion: string;
    sources: {
      notamFetchedAt: string;
      eaipVersion?: string;
      aipEffectiveFrom?: string;
      aipEffectiveUntil?: string;
    };
    counts: {
      total: number;
      activeNow: number;
    };
  };
  features: RestrictionFeature[];
};

export type InternalFeature = {
  feature: RestrictionFeature;
  sourceId: string;
  supersedes: string[];
};
