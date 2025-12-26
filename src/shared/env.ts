const TRUTHY_VALUES = ["1", "true", "yes", "on"];
const FALSEY_VALUES = ["0", "false", "no", "off"];

type EnvValues = {
  useMocks: boolean;
  mapWmtsUrl?: string;
  notamUrl: string;
  droneUrl: string;
  drones: {
    mode: "track" | "snapshot";
    snapshotUrl: string;
    centerLat?: number;
    centerLon?: number;
    radiusM: number;
    n: number;
    periodS: number;
  };
  sensorsUrl: string;
  adsbUrl: string;
  adsb: {
    mode: "live" | "mock";
    baseUrl: string;
    centerLat: number;
    centerLon: number;
    radiusNm: number;
  };
  poll: {
    defaultMs: number;
    notamMs: number;
    adsbMs: number;
    dronesMs: number;
    sensorsMs: number;
  };
};

export function parseBooleanFlag(name: string, rawValue: string | boolean | undefined, defaultValue: boolean): boolean {
  if (rawValue === undefined) {
    return defaultValue;
  }

  const normalized = String(rawValue).toLowerCase();

  if (TRUTHY_VALUES.includes(normalized)) {
    return true;
  }
  if (FALSEY_VALUES.includes(normalized)) {
    return false;
  }

  throw new Error(`${name} must be a boolean-like value (e.g. "1" or "true")`);
}

export function parsePositiveInt(name: string, rawValue: string | number | undefined, defaultValue: number): number {
  const parsed = rawValue === undefined ? defaultValue : Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer (received "${String(rawValue)}")`);
  }

  return parsed;
}

export function optionalString(name: string, rawValue: string | undefined): string | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }

  const trimmed = String(rawValue).trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseNumberInRange(
  name: string,
  rawValue: string | number | undefined,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const parsed = rawValue === undefined ? defaultValue : Number(rawValue);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be a number between ${min} and ${max} (received "${String(rawValue)}")`);
  }

  return parsed;
}

export function resolveDataUrl({
  name,
  mockUrl,
  useMocks,
  rawValue,
}: {
  name: string;
  mockUrl: string;
  useMocks: boolean;
  rawValue: string | undefined;
}): string {
  const value = optionalString(name, rawValue);

  if (useMocks) {
    return mockUrl;
  }

  if (!value) {
    throw new Error(`${name} is required when VITE_USE_MOCKS is false`);
  }

  return value;
}

export function buildAdsbPointUrl(baseUrl: string, centerLat: number, centerLon: number, radiusNm: number): string {
  const trimmedBase = baseUrl.replace(/\/+$/, "");

  return `${trimmedBase}/point/${centerLat}/${centerLon}/${radiusNm}`;
}

export function parseAdsbMode(rawValue: string | undefined): "live" | "mock" {
  const value = (rawValue ?? "live").trim().toLowerCase();
  return value === "mock" ? "mock" : "live";
}

const DEFAULT_ADSB_BASE_URL = "https://api.airplanes.live/v2";
const DEFAULT_ADSB_CENTER_LAT = 58.5648;
const DEFAULT_ADSB_CENTER_LON = 25.1122;
const DEFAULT_ADSB_RADIUS_NM = 110;

const useMocks = parseBooleanFlag("VITE_USE_MOCKS", import.meta.env.VITE_USE_MOCKS, true);
const adsbMode = import.meta.env.VITE_ADSB_MODE
  ? parseAdsbMode(import.meta.env.VITE_ADSB_MODE)
  : "live";
const adsbBaseUrl = optionalString("VITE_ADSB_BASE_URL", import.meta.env.VITE_ADSB_BASE_URL) ?? DEFAULT_ADSB_BASE_URL;
const adsbCenterLat = parseNumberInRange("VITE_ADSB_CENTER_LAT", import.meta.env.VITE_ADSB_CENTER_LAT, DEFAULT_ADSB_CENTER_LAT, -90, 90);
const adsbCenterLon = parseNumberInRange("VITE_ADSB_CENTER_LON", import.meta.env.VITE_ADSB_CENTER_LON, DEFAULT_ADSB_CENTER_LON, -180, 180);
const adsbRadiusNm = parseNumberInRange("VITE_ADSB_RADIUS_NM", import.meta.env.VITE_ADSB_RADIUS_NM, DEFAULT_ADSB_RADIUS_NM, 1, 250);
const adsbUrl = adsbMode === "mock" ? "/mock/adsb.json" : buildAdsbPointUrl(adsbBaseUrl, adsbCenterLat, adsbCenterLon, adsbRadiusNm);

const envValues: EnvValues = {
  useMocks,
  mapWmtsUrl: optionalString("VITE_MAP_WMTS_URL", import.meta.env.VITE_MAP_WMTS_URL),
  notamUrl: resolveDataUrl({
    name: "VITE_NOTAM_URL",
    mockUrl: "/mock/notams.sample.json",
    rawValue: import.meta.env.VITE_NOTAM_URL,
    useMocks,
  }),
  adsbUrl,
  adsb: {
    mode: adsbMode,
    baseUrl: adsbBaseUrl,
    centerLat: adsbCenterLat,
    centerLon: adsbCenterLon,
    radiusNm: adsbRadiusNm,
  },
  droneUrl: resolveDataUrl({
    name: "VITE_DRONE_URL",
    mockUrl: "/mock/drones.json",
    rawValue: import.meta.env.VITE_DRONE_URL,
    useMocks,
  }),
  drones: {
    mode: (import.meta.env.VITE_DRONES_MODE ?? "track") === "snapshot" ? "snapshot" : "track",
    snapshotUrl: optionalString("VITE_DRONE_SNAPSHOT_URL", import.meta.env.VITE_DRONE_SNAPSHOT_URL) ?? "http://localhost:8787/v1/drones",
    centerLat: optionalString("VITE_DRONES_CENTER_LAT", import.meta.env.VITE_DRONES_CENTER_LAT) ? Number(import.meta.env.VITE_DRONES_CENTER_LAT) : undefined,
    centerLon: optionalString("VITE_DRONES_CENTER_LON", import.meta.env.VITE_DRONES_CENTER_LON) ? Number(import.meta.env.VITE_DRONES_CENTER_LON) : undefined,
    radiusM: parsePositiveInt("VITE_DRONES_RADIUS_M", import.meta.env.VITE_DRONES_RADIUS_M, 2000),
    n: parsePositiveInt("VITE_DRONES_N", import.meta.env.VITE_DRONES_N, 1),
    periodS: parsePositiveInt("VITE_DRONES_PERIOD_S", import.meta.env.VITE_DRONES_PERIOD_S, 60),
  },
  sensorsUrl: resolveDataUrl({
    name: "VITE_SENSORS_URL",
    mockUrl: "/mock/sensors.json",
    rawValue: import.meta.env.VITE_SENSORS_URL,
    useMocks,
  }),
  poll: {
    defaultMs: parsePositiveInt("VITE_POLL_INTERVAL_MS", import.meta.env.VITE_POLL_INTERVAL_MS, 5000),
    notamMs: parsePositiveInt("VITE_POLL_NOTAM_MS", import.meta.env.VITE_POLL_NOTAM_MS, 60000),
    adsbMs: parsePositiveInt("VITE_POLL_ADSB_MS", import.meta.env.VITE_POLL_ADSB_MS, 10000),
    dronesMs: parsePositiveInt("VITE_POLL_DRONES_MS", import.meta.env.VITE_POLL_DRONES_MS, 1000),
    sensorsMs: parsePositiveInt("VITE_POLL_SENSORS_MS", import.meta.env.VITE_POLL_SENSORS_MS, 1000),
  },
};

export const ENV = {
  useMocks: () => envValues.useMocks,
  mapWmtsUrl: () => envValues.mapWmtsUrl,
  notamUrl: () => envValues.notamUrl,
  adsbUrl: () => envValues.adsbUrl,
  droneUrl: () => envValues.droneUrl,
  drones: {
    mode: () => envValues.drones.mode,
    snapshotUrl: () => envValues.drones.snapshotUrl,
    centerLat: () => envValues.drones.centerLat,
    centerLon: () => envValues.drones.centerLon,
    radiusM: () => envValues.drones.radiusM,
    n: () => envValues.drones.n,
    periodS: () => envValues.drones.periodS,
  },
  sensorsUrl: () => envValues.sensorsUrl,
  adsb: {
    mode: () => envValues.adsb.mode,
    baseUrl: () => envValues.adsb.baseUrl,
    centerLat: () => envValues.adsb.centerLat,
    centerLon: () => envValues.adsb.centerLon,
    radiusNm: () => envValues.adsb.radiusNm,
  },
  poll: {
    defaultMs: () => envValues.poll.defaultMs,
    notamMs: () => envValues.poll.notamMs,
    adsbMs: () => envValues.poll.adsbMs,
    dronesMs: () => envValues.poll.dronesMs,
    sensorsMs: () => envValues.poll.sensorsMs,
  },
};
