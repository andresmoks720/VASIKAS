import { Altitude, LonLat } from "@/shared/types/domain";

export type { LonLat } from "@/shared/types/domain";

export type DroneDto = {
  id: string;
  label: string;
  position: LonLat;
  headingDeg: number;
  speedMps: number;
  altitude: Altitude;
  eventTimeUtc: string;
};

export type Drone = DroneDto & { ingestTimeUtc: string };

export function mapDroneDto(dto: DroneDto, ingestTimeUtc: string): Drone {
  return {
    ...dto,
    ingestTimeUtc,
  };
}

export function mapDroneDtos(dtos: DroneDto[], ingestTimeUtc: string): Drone[] {
  return dtos.map((dto) => mapDroneDto(dto, ingestTimeUtc));
}
