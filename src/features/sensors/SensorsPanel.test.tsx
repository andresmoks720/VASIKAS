import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SensorsPanel } from "./SensorsPanel";
import * as StreamsProvider from "@/services/streams/StreamsProvider";
import { makeSensor } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

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
        remove: (...args: unknown[]) => mockRemove(...args),
        create: (...args: unknown[]) => mockCreate(...args),
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

        renderWithRouter(<SensorsPanel />, { route: "/sensors" });
        expect(screen.getByText("No sensors available.")).toBeInTheDocument();
    });

    it("renders sensors split by source", () => {
        const mockSensors = [
            makeSensor({ id: "s1", name: "Base Radar", source: "base" }),
            makeSensor({ id: "s2", name: "User Radar", source: "user" }),
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

        renderWithRouter(<SensorsPanel />, { route: "/sensors" });
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

        renderWithRouter(<SensorsPanel />, { route: "/sensors" });
        fireEvent.click(screen.getByRole("button", { name: "Add" }));
    });
});
