import { LonLat } from "@/shared/types/domain";

export type SensorDto = {
  id: string;
  name: string;
  kind: string;
  position: LonLat;
  status: "online" | "offline" | "degraded";
  lastSeenUtc: string;
  coverage: { radiusMeters: number; minAltM: number; maxAltM: number };
};

export type Sensor = SensorDto & {
  ingestTimeUtc: string;
  source: "base" | "user";
};

export function mapSensorDto(dto: SensorDto, ingestTimeUtc: string, source: "base" | "user" = "base"): Sensor {
  return { ...dto, ingestTimeUtc, source };
}

export function mapSensorDtos(dtos: SensorDto[], ingestTimeUtc: string): Sensor[] {
  return dtos.map((dto) => mapSensorDto(dto, ingestTimeUtc, "base"));
}
