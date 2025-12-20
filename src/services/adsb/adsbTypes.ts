import { Altitude, LonLat } from "@/shared/types/domain";

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

export type Aircraft = {
  id: string;
  callsign: string;
  position: LonLat;
  trackDeg: number;
  groundSpeedKmh: number;
  altitude: Altitude;
  eventTimeUtc: string;
  ingestTimeUtc: string;
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
