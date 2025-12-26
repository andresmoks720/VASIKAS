import { AltitudeSource } from "@/shared/types/domain";
import { Drone } from "./droneTypes";

export type SnapshotDroneDto = {
    id: string;
    label?: string;
    position: { lon: number; lat: number };
    headingDeg: number;
    speedMps: number | null;
    altitude: {
        meters: number | null;
        ref: "AGL" | "MSL";
        source: AltitudeSource;
        comment: string;
    };
    eventTimeUtc?: string;
};

export type SnapshotDronesResponseDto = {
    server_time_utc: string;
    t_sec_used: number;
    center: { lat: number; lon: number };
    meta?: Record<string, unknown>;
    drones: SnapshotDroneDto[];
};

export function mapSnapshotDroneDtoToDomain(
    dto: SnapshotDroneDto,
    ingestTimeUtc: string
): Drone {
    return {
        id: dto.id,
        label: dto.label && dto.label.trim().length > 0 ? dto.label : dto.id,
        position: dto.position,
        headingDeg: dto.headingDeg,
        speedMps: dto.speedMps ?? 0,
        altitude: {
            meters: dto.altitude.meters ?? 0,
            ref: dto.altitude.ref,
            source: dto.altitude.source,
            comment:
                dto.altitude.comment && dto.altitude.comment.trim().length > 0
                    ? dto.altitude.comment
                    : "mock snapshot",
        },
        eventTimeUtc: dto.eventTimeUtc ?? ingestTimeUtc,
        ingestTimeUtc,
    };
}
