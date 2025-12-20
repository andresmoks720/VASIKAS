import { Drone, DroneTrack } from "./droneTypes";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpNullable(a: number | null, b: number | null, t: number): number | null {
  if (a == null && b == null) {
    return null;
  }
  if (a == null) {
    return b;
  }
  if (b == null) {
    return a;
  }
  return lerp(a, b, t);
}

function normalizeTrack(track: DroneTrack) {
  const points = track.track.map((point) => ({
    ...point,
    timestampMs: Date.parse(point.timeUtc),
  }));

  const startMs = points[0].timestampMs;
  const endMs = points[points.length - 1].timestampMs;

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs === endMs) {
    return { points, startMs, durationMs: 0 };
  }

  return { points, startMs, durationMs: endMs - startMs };
}

function interpolateDroneSample(track: DroneTrack, nowUtc: string) {
  const { points, startMs, durationMs } = normalizeTrack(track);
  const nowMs = Date.parse(nowUtc);

  if (!Number.isFinite(nowMs)) {
    throw new Error("Invalid timestamp for drone track sampling");
  }

  if (points.length === 1 || durationMs <= 0) {
    return { ...points[0], eventTimeUtc: points[0].timeUtc };
  }

  const elapsedMs = ((nowMs - startMs) % durationMs + durationMs) % durationMs;
  const elapsedSec = elapsedMs / 1000;

  const offsets = points.map((p) => (p.timestampMs - startMs) / 1000);
  const extended = [...points, { ...points[0], timestampMs: points[0].timestampMs + durationMs }];
  const extendedOffsets = [...offsets, offsets[0] + durationMs / 1000];

  let segmentIndex = extendedOffsets.findIndex(
    (offset, idx) => offset <= elapsedSec && idx < extendedOffsets.length - 1 && elapsedSec < extendedOffsets[idx + 1],
  );

  if (segmentIndex === -1) {
    segmentIndex = extendedOffsets.length - 2;
  }

  const nextIndex = segmentIndex + 1;
  const prev = extended[segmentIndex];
  const next = extended[nextIndex];
  const prevOffset = extendedOffsets[segmentIndex];
  const nextOffset = extendedOffsets[nextIndex];
  const span = nextOffset - prevOffset || 1;
  const t = Math.min(1, Math.max(0, (elapsedSec - prevOffset) / span));

  const position = {
    lon: lerp(prev.position.lon, next.position.lon, t),
    lat: lerp(prev.position.lat, next.position.lat, t),
  };

  const altitude = {
    ...prev.altitude,
    meters: lerpNullable(prev.altitude.meters, next.altitude.meters, t),
    rawText: prev.altitude.rawText ?? next.altitude.rawText,
  };

  const eventTimeUtc = new Date(startMs + elapsedSec * 1000).toISOString();

  return {
    position,
    altitude,
    headingDeg: lerp(prev.headingDeg, next.headingDeg, t),
    speedMps: lerp(prev.speedMps, next.speedMps, t),
    eventTimeUtc,
  };
}

export function computeDroneAtTime(track: DroneTrack, nowUtc: string, ingestTimeUtc: string): Drone {
  const sample = interpolateDroneSample(track, nowUtc);

  return {
    id: track.id,
    label: track.label,
    position: sample.position,
    headingDeg: sample.headingDeg,
    speedMps: sample.speedMps,
    altitude: sample.altitude,
    eventTimeUtc: sample.eventTimeUtc,
    ingestTimeUtc,
  };
}
