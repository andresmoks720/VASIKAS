import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SensorsPanel } from "./SensorsPanel";
import { Sensor } from "@/services/sensors/sensorsTypes";
import * as StreamsProvider from "@/services/streams/StreamsProvider";

// Mock the sidebar state
vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
    useSidebarUrlState: () => ({
        selectEntity: vi.fn(),
    }),
}));

// Mock the sensor store
const mockRemove = vi.fn();
const mockCreate = vi.fn();
vi.mock("@/services/sensors/sensorStore", () => ({
    sensorStore: {
        remove: (...args: any[]) => mockRemove(...args),
        create: (...args: any[]) => mockCreate(...args),
    },
}));

describe("SensorsPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders empty state", () => {
        vi.spyOn(StreamsProvider, "useSharedSensorsStream").mockReturnValue({
            data: [],
            status: "live",
            lastOkUtc: "",
            lastErrorUtc: null,
            tick: 0,
            ageSeconds: 0,
            error: null,
        });

        render(<SensorsPanel />);
        expect(screen.getByText("No sensors available.")).toBeInTheDocument();
    });

    it("renders sensors split by source", () => {
        const mockSensors: Sensor[] = [
            { id: "s1", name: "Base Radar", kind: "radar", position: { lat: 0, lon: 0 }, status: "online", lastSeenUtc: "", coverage: { radiusMeters: 0, minAltM: 0, maxAltM: 0 }, ingestTimeUtc: "", source: "base" },
            { id: "s2", name: "User Radar", kind: "radar", position: { lat: 0, lon: 0 }, status: "online", lastSeenUtc: "", coverage: { radiusMeters: 0, minAltM: 0, maxAltM: 0 }, ingestTimeUtc: "", source: "user" },
        ];

        vi.spyOn(StreamsProvider, "useSharedSensorsStream").mockReturnValue({
            data: mockSensors,
            status: "live",
            lastOkUtc: "",
            lastErrorUtc: null,
            tick: 0,
            ageSeconds: 0,
            error: null,
        });

        render(<SensorsPanel />);
        expect(screen.getByText("Base Sensors")).toBeInTheDocument();
        expect(screen.getByText("User Sensors")).toBeInTheDocument();
        expect(screen.getByText("Base Radar")).toBeInTheDocument();
        expect(screen.getByText("User Radar")).toBeInTheDocument();
    });

    it("opens add dialog", () => {
        vi.spyOn(StreamsProvider, "useSharedSensorsStream").mockReturnValue({
            data: [],
            status: "live",
            lastOkUtc: "",
            lastErrorUtc: null,
            tick: 0,
            ageSeconds: 0,
            error: null,
        });

        render(<SensorsPanel />);
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
    });
});
