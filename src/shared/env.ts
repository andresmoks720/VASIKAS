const TRUTHY_VALUES = ["1", "true", "yes", "on"];
const FALSEY_VALUES = ["0", "false", "no", "off"];

type EnvValues = {
  useMocks: boolean;
  mapWmtsUrl?: string;
  notamUrl: string;
  adsbUrl: string;
  droneUrl: string;
  sensorsUrl: string;
  poll: {
    defaultMs: number;
    notamMs: number;
    adsbMs: number;
    dronesMs: number;
    sensorsMs: number;
  };
};

function parseBooleanFlag(name: string, rawValue: string | boolean | undefined, defaultValue: boolean): boolean {
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

function parsePositiveInt(name: string, rawValue: string | number | undefined, defaultValue: number): number {
  const parsed = rawValue === undefined ? defaultValue : Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer (received "${String(rawValue)}")`);
  }

  return parsed;
}

function optionalString(name: string, rawValue: string | undefined): string | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }

  const trimmed = String(rawValue).trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function resolveDataUrl({ name, mockUrl, useMocks, rawValue }: { name: string; mockUrl: string; useMocks: boolean; rawValue: string | undefined }): string {
  const value = optionalString(name, rawValue);

  if (useMocks) {
    return mockUrl;
  }

  if (!value) {
    throw new Error(`${name} is required when VITE_USE_MOCKS is false`);
  }

  return value;
}

const useMocks = parseBooleanFlag("VITE_USE_MOCKS", import.meta.env.VITE_USE_MOCKS, true);

const envValues: EnvValues = {
  useMocks,
  mapWmtsUrl: optionalString("VITE_MAP_WMTS_URL", import.meta.env.VITE_MAP_WMTS_URL),
  notamUrl: resolveDataUrl({
    name: "VITE_NOTAM_URL",
    mockUrl: "/mock/notams.sample.json",
    rawValue: import.meta.env.VITE_NOTAM_URL,
    useMocks,
  }),
  adsbUrl: resolveDataUrl({
    name: "VITE_ADSB_URL",
    mockUrl: "/mock/adsb.json",
    rawValue: import.meta.env.VITE_ADSB_URL,
    useMocks,
  }),
  droneUrl: resolveDataUrl({
    name: "VITE_DRONE_URL",
    mockUrl: "/mock/drones.json",
    rawValue: import.meta.env.VITE_DRONE_URL,
    useMocks,
  }),
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
  sensorsUrl: () => envValues.sensorsUrl,
  poll: {
    defaultMs: () => envValues.poll.defaultMs,
    notamMs: () => envValues.poll.notamMs,
    adsbMs: () => envValues.poll.adsbMs,
    dronesMs: () => envValues.poll.dronesMs,
    sensorsMs: () => envValues.poll.sensorsMs,
  },
};
