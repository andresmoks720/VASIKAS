import { Aircraft, AdsbTrack, AdsbTrackPointDto } from "./adsbTypes";
import { LonLat } from "@/shared/types/domain";

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

function normalizeElapsedSeconds(t0Utc: string, durationSec: number, nowUtc: string): number {
  const startMs = Date.parse(t0Utc);
  const nowMs = Date.parse(nowUtc);

  if (!Number.isFinite(startMs) || !Number.isFinite(nowMs)) {
    throw new Error("Invalid ADS-B track timestamps");
  }

  if (!(durationSec > 0)) {
    throw new Error("ADS-B track duration must be positive");
  }

  const durationMs = durationSec * 1000;
  const elapsedMs = nowMs - startMs;
  const wrappedMs = ((elapsedMs % durationMs) + durationMs) % durationMs;

  return wrappedMs / 1000;
}

function interpolatePosition(
  track: AdsbTrackPointDto[],
  elapsedSec: number,
  durationSec: number,
): AdsbTrackPointDto {
  if (!track.length) {
    throw new Error("ADS-B track requires at least one sample");
  }

  if (track.length === 1) {
    return { ...track[0] };
  }

  const extendedTrack = [...track, { ...track[0], offsetSec: track[0].offsetSec + durationSec }];
  const segmentIndex = extendedTrack.findIndex(
    (point, idx) =>
      point.offsetSec <= elapsedSec &&
      idx < extendedTrack.length - 1 &&
      elapsedSec < extendedTrack[idx + 1].offsetSec,
  );

  const prev = extendedTrack[segmentIndex === -1 ? extendedTrack.length - 2 : segmentIndex];
  const next = extendedTrack[segmentIndex === -1 ? extendedTrack.length - 1 : segmentIndex + 1];

  const span = next.offsetSec - prev.offsetSec || 1;
  const t = Math.min(1, Math.max(0, (elapsedSec - prev.offsetSec) / span));

  const position: LonLat = {
    lon: lerp(prev.position.lon, next.position.lon, t),
    lat: lerp(prev.position.lat, next.position.lat, t),
  };

  const altitude = {
    ...prev.altitude,
    meters: lerpNullable(prev.altitude.meters, next.altitude.meters, t),
    rawText: prev.altitude.rawText ?? next.altitude.rawText,
  };

  return {
    offsetSec: elapsedSec,
    position,
    trackDeg: lerp(prev.trackDeg, next.trackDeg, t),
    groundSpeedKmh: lerp(prev.groundSpeedKmh, next.groundSpeedKmh, t),
    altitude,
  };
}

export function computeAircraftAtTime(track: AdsbTrack, nowUtc: string, ingestTimeUtc: string): Aircraft {
  const elapsedSec = normalizeElapsedSeconds(track.t0Utc, track.durationSec, nowUtc);
  const sample = interpolatePosition(track.track, elapsedSec, track.durationSec);
  const eventTimeUtc = new Date(Date.parse(track.t0Utc) + elapsedSec * 1000).toISOString();

  return {
    id: track.id,
    callsign: track.callsign,
    position: sample.position,
    trackDeg: sample.trackDeg,
    groundSpeedKmh: sample.groundSpeedKmh,
    altitude: sample.altitude,
    eventTimeUtc,
    ingestTimeUtc,
  };
}
