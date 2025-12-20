import { Altitude, LonLat } from "@/shared/types/domain";

export type { LonLat } from "@/shared/types/domain";

export type DroneTrackPointDto = {
  timeUtc: string;
  position: LonLat;
  headingDeg: number;
  speedMps: number;
  altitude: Altitude;
};

export type DroneTrackDto = {
  id: string;
  label: string;
  track: DroneTrackPointDto[];
};

export type DroneTrack = DroneTrackDto;

export type Drone = {
  id: string;
  label: string;
  position: LonLat;
  headingDeg: number;
  speedMps: number;
  altitude: Altitude;
  eventTimeUtc: string;
  ingestTimeUtc: string;
};

function ensureAltitudeComment(altitude: Altitude): Altitude {
  if (altitude.comment && altitude.comment.trim().length > 0) {
    return altitude;
  }
  return { ...altitude, comment: "mock track" };
}

export function mapDroneTrackDto(dto: DroneTrackDto): DroneTrack {
  if (!Array.isArray(dto.track) || dto.track.length === 0) {
    throw new Error("Drone track must contain at least one sample");
  }

  return {
    ...dto,
    track: dto.track
      .map((point) => ({ ...point, altitude: ensureAltitudeComment(point.altitude) }))
      .sort((a, b) => Date.parse(a.timeUtc) - Date.parse(b.timeUtc)),
  };
}

export function mapDroneTrackDtos(dtos: DroneTrackDto[]): DroneTrack[] {
  return dtos.map(mapDroneTrackDto);
}
