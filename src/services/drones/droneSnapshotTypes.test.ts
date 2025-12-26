import { describe, it, expect } from "vitest";
import { mapSnapshotDroneDtoToDomain, SnapshotDroneDto } from "./droneSnapshotTypes";

describe("mapSnapshotDroneDtoToDomain", () => {
    const ingestTimeUtc = "2025-12-26T12:00:00Z";
    const minimalDto: SnapshotDroneDto = {
        id: "d1",
        position: { lon: 25.0, lat: 58.0 },
        headingDeg: 90,
        speedMps: 10,
        altitude: { meters: 100, ref: "AGL", source: "mock", comment: "" },
    };

    it("maps basic fields correctly", () => {
        const domain = mapSnapshotDroneDtoToDomain(minimalDto, ingestTimeUtc);
        expect(domain.id).toBe("d1");
        expect(domain.position).toEqual({ lon: 25.0, lat: 58.0 });
        expect(domain.headingDeg).toBe(90);
        expect(domain.speedMps).toBe(10);
        expect(domain.ingestTimeUtc).toBe(ingestTimeUtc);
    });

    it("defaults label to id if missing or empty", () => {
        const d1 = mapSnapshotDroneDtoToDomain({ ...minimalDto, label: undefined }, ingestTimeUtc);
        expect(d1.label).toBe("d1");

        const d2 = mapSnapshotDroneDtoToDomain({ ...minimalDto, label: "   " }, ingestTimeUtc);
        expect(d2.label).toBe("d1");

        const d3 = mapSnapshotDroneDtoToDomain({ ...minimalDto, label: "My Drone" }, ingestTimeUtc);
        expect(d3.label).toBe("My Drone");
    });

    it("injects default comment if altitude comment is missing", () => {
        const d1 = mapSnapshotDroneDtoToDomain(minimalDto, ingestTimeUtc);
        expect(d1.altitude.comment).toBe("mock snapshot");

        const d2 = mapSnapshotDroneDtoToDomain(
            { ...minimalDto, altitude: { ...minimalDto.altitude, comment: "original" } },
            ingestTimeUtc
        );
        expect(d2.altitude.comment).toBe("original");
    });

    it("uses eventTimeUtc if present, otherwise fallback to ingestTimeUtc", () => {
        const eventTime = "2025-12-26T11:59:59Z";
        const d1 = mapSnapshotDroneDtoToDomain({ ...minimalDto, eventTimeUtc: eventTime }, ingestTimeUtc);
        expect(d1.eventTimeUtc).toBe(eventTime);

        const d2 = mapSnapshotDroneDtoToDomain({ ...minimalDto, eventTimeUtc: undefined }, ingestTimeUtc);
        expect(d2.eventTimeUtc).toBe(ingestTimeUtc);
    });

    it("handles null values safely", () => {
        const d1 = mapSnapshotDroneDtoToDomain({
            ...minimalDto,
            speedMps: null,
            altitude: { ...minimalDto.altitude, meters: null }
        }, ingestTimeUtc);

        expect(d1.speedMps).toBe(0);
        expect(d1.altitude.meters).toBe(0);
    });
});
