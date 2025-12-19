import { Altitude, LonLat } from "@/shared/types/domain";

export type AdsbDto = {
  id: string;
  callsign: string;
  position: LonLat;
  trackDeg: number;
  groundSpeedKmh: number;
  altitude: Altitude;
  eventTimeUtc: string;
};

export type Aircraft = AdsbDto & { ingestTimeUtc: string };

export function mapAdsbDto(dto: AdsbDto, ingestTimeUtc: string): Aircraft {
  return { ...dto, ingestTimeUtc };
}

export function mapAdsbDtos(dtos: AdsbDto[], ingestTimeUtc: string): Aircraft[] {
  return dtos.map((dto) => mapAdsbDto(dto, ingestTimeUtc));
}
