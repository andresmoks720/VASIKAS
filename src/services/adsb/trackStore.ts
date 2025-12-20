import { LonLat } from "@/shared/types/domain";

export type TrackPoint = {
  position: LonLat;
  eventTimeUtc: string;
};

export type TrackStoreOptions = {
  maxPoints?: number;
  maxAgeMs?: number;
  maxMissedPolls?: number;
};

type TrackState = {
  points: TrackPoint[];
  missed: number;
};

type StoreState = Map<string, TrackState>;

const DEFAULT_MAX_POINTS = 30;
const DEFAULT_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_MISSED_POLLS = 6; // ~1 minute at 10s polling

function parseTimeMs(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pruneOldPoints(points: TrackPoint[], nowMs: number, maxAgeMs: number): TrackPoint[] {
  return points.filter((pt) => {
    const timeMs = parseTimeMs(pt.eventTimeUtc);
    if (timeMs === null) {
      return false;
    }

    return nowMs - timeMs <= maxAgeMs;
  });
}

function appendPoint(points: TrackPoint[], next: TrackPoint, maxPoints: number): TrackPoint[] {
  const last = points[points.length - 1];
  const lastTime = last ? parseTimeMs(last.eventTimeUtc) : null;
  const nextTime = parseTimeMs(next.eventTimeUtc);

  if (last && last.position.lon === next.position.lon && last.position.lat === next.position.lat && last.eventTimeUtc === next.eventTimeUtc) {
    return points;
  }

  if (lastTime !== null && nextTime !== null && nextTime < lastTime) {
    return points;
  }

  const appended = [...points, next];

  if (appended.length <= maxPoints) {
    return appended;
  }

  return appended.slice(appended.length - maxPoints);
}

export type TrackStoreUpdateResult = {
  state: StoreState;
  tracks: Map<string, TrackPoint[]>;
};

export function updateTrackStore(
  prevState: StoreState,
  flights: { id: string; position: LonLat; eventTimeUtc: string }[],
  opts: TrackStoreOptions = {},
  nowMs = Date.now(),
): TrackStoreUpdateResult {
  const maxPoints = opts.maxPoints ?? DEFAULT_MAX_POINTS;
  const maxAgeMs = opts.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
  const maxMissedPolls = opts.maxMissedPolls ?? DEFAULT_MAX_MISSED_POLLS;

  const nextState: StoreState = new Map(prevState);
  const seenIds = new Set<string>();

  flights.forEach((flight) => {
    const prev = nextState.get(flight.id) ?? { points: [], missed: 0 };
    const pruned = pruneOldPoints(prev.points, nowMs, maxAgeMs);
    const updatedPoints = appendPoint(pruned, { position: flight.position, eventTimeUtc: flight.eventTimeUtc }, maxPoints);

    if (updatedPoints.length > 0) {
      nextState.set(flight.id, { points: updatedPoints, missed: 0 });
      seenIds.add(flight.id);
    }
  });

  prevState.forEach((value, id) => {
    if (seenIds.has(id)) {
      return;
    }

    const pruned = pruneOldPoints(value.points, nowMs, maxAgeMs);
    const missed = value.missed + 1;
    if (pruned.length === 0 || missed >= maxMissedPolls) {
      nextState.delete(id);
      return;
    }

    nextState.set(id, { points: pruned, missed });
  });

  const tracks = new Map<string, TrackPoint[]>();
  nextState.forEach((state, id) => {
    if (state.points.length > 0) {
      tracks.set(id, state.points);
    }
  });

  return { state: nextState, tracks };
}
