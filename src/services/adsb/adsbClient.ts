import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { usePolling } from "@/services/polling/usePolling";
import { ENV } from "@/shared/env";
import { computeAircraftAtTime } from "./adsbMotion";
import {
  AdsbPointResponseDto,
  AdsbTrack,
  AdsbTrackDto,
  Aircraft,
  AircraftDto,
  mapAdsbTrackDtos,
} from "./adsbTypes";
import { updateTrackStore } from "./trackStore";
import { feetToMeters } from "@/shared/units/altitude";
import { LonLat } from "@/shared/types/domain";

const DEFAULT_POLL_MS = 10000;
const MOTION_TICK_MS = 1000;
const KNOTS_TO_KMH = 1.852;

function parsePollInterval(raw?: string | number): number {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

function parseMockAdsbResponse(raw: unknown): AdsbTrack[] {
  if (!Array.isArray(raw)) {
    throw new Error("ADS-B response must be an array");
  }

  return mapAdsbTrackDtos(raw as AdsbTrackDto[]);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function selectPosition(dto: AircraftDto): { position: LonLat; source: Aircraft["positionSource"] } | null {
  if (isFiniteNumber(dto.lon) && isFiniteNumber(dto.lat)) {
    return { position: { lon: dto.lon, lat: dto.lat }, source: "current" };
  }

  if (dto.lastPosition && isFiniteNumber(dto.lastPosition.lon) && isFiniteNumber(dto.lastPosition.lat)) {
    return { position: { lon: dto.lastPosition.lon, lat: dto.lastPosition.lat }, source: "lastPosition" };
  }

  if (isFiniteNumber(dto.rr_lon) && isFiniteNumber(dto.rr_lat)) {
    return { position: { lon: dto.rr_lon, lat: dto.rr_lat }, source: "rough" };
  }

  return null;
}

function mapAltitude(alt_baro: AircraftDto["alt_baro"]) {
  if (alt_baro === "ground") {
    return {
      meters: 0,
      ref: "MSL" as const,
      source: "reported" as const,
      comment: "ADS-B baro (ground)",
      rawText: "ground",
    };
  }

  if (isFiniteNumber(alt_baro)) {
    return {
      meters: feetToMeters(alt_baro),
      ref: "MSL" as const,
      source: "reported" as const,
      comment: "ADS-B baro",
    };
  }

  return {
    meters: null,
    ref: "MSL" as const,
    source: "reported" as const,
    comment: "ADS-B baro",
  };
}

function mapGroundSpeed(gs: AircraftDto["gs"]): number | null {
  if (!isFiniteNumber(gs)) {
    return null;
  }

  return gs * KNOTS_TO_KMH;
}

function mapHeading(dto: AircraftDto): number | null {
  if (isFiniteNumber(dto.track)) return dto.track;
  if (isFiniteNumber(dto.true_heading)) return dto.true_heading;
  if (isFiniteNumber(dto.mag_heading)) return dto.mag_heading;
  return null;
}

function deriveEventTimeUtc(nowEpochSec: number, dto: AircraftDto): string {
  const ageSec =
    isFiniteNumber(dto.seen_pos) && dto.seen_pos >= 0
      ? dto.seen_pos
      : isFiniteNumber(dto.seen) && dto.seen >= 0
        ? dto.seen
        : null;

  const eventEpochSec = ageSec == null ? nowEpochSec : nowEpochSec - ageSec;

  return new Date(eventEpochSec * 1000).toISOString();
}

function mapCallsign(dto: AircraftDto): string {
  const trimmedFlight = (dto.flight ?? "").trim();
  if (trimmedFlight.length > 0) {
    return trimmedFlight;
  }

  const registration = (dto.r ?? "").trim();
  if (registration.length > 0) {
    return registration;
  }

  return (dto.hex ?? "").trim();
}

export function mapAircraftDto(dto: AircraftDto, context: { nowEpochSec: number; ingestTimeUtc: string }): Aircraft | null {
  const id = (dto.hex ?? "").trim();

  if (!id) {
    return null;
  }

  const position = selectPosition(dto);

  if (!position) {
    return null;
  }

  return {
    id,
    callsign: mapCallsign(dto),
    position: position.position,
    positionSource: position.source,
    trackDeg: mapHeading(dto),
    groundSpeedKmh: mapGroundSpeed(dto.gs),
    altitude: mapAltitude(dto.alt_baro),
    eventTimeUtc: deriveEventTimeUtc(context.nowEpochSec, dto),
    ingestTimeUtc: context.ingestTimeUtc,
  };
}

export function parseLiveAdsbResponse(raw: unknown, ingestTimeUtc: string): Aircraft[] {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("ADS-B response must be an object");
  }

  const response = raw as AdsbPointResponseDto;
  const nowEpochSec = isFiniteNumber(response.now) ? response.now : Math.floor(Date.now() / 1000);
  const aircraftList = Array.isArray(response.aircraft) ? response.aircraft : [];

  return aircraftList
    .map((aircraft) => mapAircraftDto(aircraft, { nowEpochSec, ingestTimeUtc }))
    .filter((item): item is Aircraft => item !== null);
}

export function useAdsbStream() {
  const useMocks = ENV.useMocks();
  const url = useMocks ? "/mock/adsb.json" : ENV.adsbUrl();
  const pollMs = parsePollInterval(ENV.poll.adsbMs());
  const [motionTick, setMotionTick] = useState(0);
  const trackStoreRef = useRef<ReturnType<typeof updateTrackStore>["state"]>(new Map());

  const mapper = useCallback(
    (raw: unknown) => (useMocks ? parseMockAdsbResponse(raw) : parseLiveAdsbResponse(raw, new Date().toISOString())),
    [useMocks],
  );

  const polled = usePolling<AdsbTrack[] | Aircraft[]>(`adsb:${url}`, url, pollMs, mapper);

  useEffect(() => {
    if (!useMocks) {
      return;
    }

    const timer = window.setInterval(() => {
      setMotionTick((tick) => tick + 1);
    }, MOTION_TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [useMocks]);

  const aircraft = useMemo(() => {
    if (!polled.data) {
      return null;
    }

    if (useMocks) {
      void motionTick;
      const nowUtc = new Date().toISOString();

      return (polled.data as AdsbTrack[]).map((track) => computeAircraftAtTime(track, nowUtc, nowUtc));
    }

    return polled.data as Aircraft[];
  }, [polled.data, useMocks, motionTick]);

  const tracks = useMemo(() => {
    if (!aircraft || useMocks) {
      trackStoreRef.current = new Map();
      return new Map();
    }

    const { state, tracks: nextTracks } = updateTrackStore(
      trackStoreRef.current,
      aircraft.map((item) => ({ id: item.id, position: item.position, eventTimeUtc: item.eventTimeUtc })),
    );

    trackStoreRef.current = state;

    return nextTracks;
  }, [aircraft, useMocks]);

  return { ...polled, data: aircraft, tracks };
}
