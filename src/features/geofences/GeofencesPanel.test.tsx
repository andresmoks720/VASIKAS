import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GeofencesPanel } from "./GeofencesPanel";
import { geofenceStore } from "@/services/geofences/geofenceStore";
import { mapApi } from "@/map/mapApi";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock dependencies
vi.mock("@/layout/MapShell/useSidebarUrlState", () => ({
    useSidebarUrlState: () => ({ selectEntity: vi.fn() }),
}));

vi.mock("@/services/geofences/geofenceStore");
vi.mock("@/map/mapApi", () => ({
    mapApi: {
        setGeofences: vi.fn(),
    },
}));

describe("GeofencesPanel", () => {
    const mockGeofences = [
        {
            id: "1",
            name: "Test Zone",
            kind: "circle",
            geometry: { kind: "circle", center: { lon: 24, lat: 59 }, radiusMeters: 500 },
            createdAtUtc: "2023-01-01",
            updatedAtUtc: "2023-01-01",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (geofenceStore.getAll as any).mockReturnValue(mockGeofences);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders list of geofences", () => {
        render(<GeofencesPanel />);
        expect(screen.getByText("Test Zone")).toBeInTheDocument();
    });

    it("opens create dialog on Add click", () => {
        render(<GeofencesPanel />);
        fireEvent.click(screen.getByText("Add"));
        expect(screen.getByText("Create Geofence")).toBeInTheDocument();
    });

    it("calls store.createCircle on create submit", async () => {
        (geofenceStore.getAll as any).mockReturnValue([]);
        render(<GeofencesPanel />);

        // Open dialog
        fireEvent.click(screen.getByText("Add"));

        // Fill form
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Zone" } });
        fireEvent.change(screen.getByLabelText("Lat"), { target: { value: "59.5" } });
        fireEvent.change(screen.getByLabelText("Lon"), { target: { value: "24.5" } });
        fireEvent.change(screen.getByLabelText("Radius (m)"), { target: { value: "100" } });

        // Submit
        fireEvent.click(screen.getByText("Create"));

        expect(geofenceStore.createCircle).toHaveBeenCalledWith(expect.objectContaining({
            name: "New Zone",
            center: { lon: 24.5, lat: 59.5 },
            radiusMeters: 100
        }));

        // Should refresh map
        expect(mapApi.setGeofences).toHaveBeenCalled();
    });

    it("calls store.remove on delete click", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);
        render(<GeofencesPanel />);

        fireEvent.click(screen.getByText("Delete"));

        expect(geofenceStore.remove).toHaveBeenCalledWith("1");
        expect(mapApi.setGeofences).toHaveBeenCalled();
        confirmSpy.mockRestore();
    });
});
