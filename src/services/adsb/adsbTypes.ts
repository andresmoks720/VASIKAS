import { Altitude, LonLat } from "@/shared/types/domain";

// Live ADS-B DTOs (airplanes.live)
export type AdsbPointResponseDto = {
  now?: number;
  msg?: string;
  total?: number;
  ctime?: number;
  ptime?: number;
  aircraft?: AircraftDto[];
  ac?: AircraftDto[]; // airplanes.live uses 'ac'
};

export type LastPositionDto = {
  lat?: number;
  lon?: number;
  seen_pos?: number;
  seen?: number;
};

export type AircraftDto = {
  hex?: string;
  flight?: string;
  lat?: number;
  lon?: number;
  seen_pos?: number;
  seen?: number;
  alt_baro?: number | "ground";
  gs?: number;
  track?: number;
  true_heading?: number;
  mag_heading?: number;
  r?: string; // registration
  t?: string; // type
  type?: string;
  lastPosition?: LastPositionDto;
  rr_lat?: number;
  rr_lon?: number;
};

export type PositionSource = "current" | "lastPosition" | "rough";

export type Aircraft = {
  id: string;
  callsign: string;
  position: LonLat;
  positionSource: PositionSource;
  trackDeg: number | null;
  groundSpeedKmh: number | null;
  altitude: Altitude;
  eventTimeUtc: string;
  ingestTimeUtc: string;
  registration?: string;
  aircraftType?: string;
};

// Mock ADS-B track DTOs (legacy mock interpolation)
export type AdsbTrackPointDto = {
  offsetSec: number;
  position: LonLat;
  trackDeg: number;
  groundSpeedKmh: number;
  altitude: Altitude;
};

export type AdsbTrackDto = {
  id: string;
  callsign: string;
  t0Utc: string;
  durationSec: number;
  track: AdsbTrackPointDto[];
};

export type AdsbTrack = Omit<AdsbTrackDto, "track"> & {
  track: AdsbTrackPointDto[];
};

export function mapAdsbTrackDto(dto: AdsbTrackDto): AdsbTrack {
  if (!Array.isArray(dto.track) || dto.track.length === 0) {
    throw new Error("ADS-B track must contain at least one sample");
  }

  const sortedTrack = [...dto.track].sort((a, b) => a.offsetSec - b.offsetSec);

  return {
    ...dto,
    track: sortedTrack,
  };
}

export function mapAdsbTrackDtos(dtos: AdsbTrackDto[]): AdsbTrack[] {
  return dtos.map(mapAdsbTrackDto);
}
