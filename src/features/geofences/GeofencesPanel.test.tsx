import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { GeofencesPanel } from "./GeofencesPanel";
import { Geofence, geofenceStore } from "@/services/geofences/geofenceStore";
import { mapApi } from "@/map/mapApi";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { makeGeofence } from "@/shared/test/factories";
import { renderWithRouter } from "@/shared/test/render";

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
    const mockedGeofenceStore = vi.mocked(geofenceStore);
    const mockGeofences: Geofence[] = [makeGeofence({ id: "1", name: "Test Zone" })];

    beforeEach(() => {
        vi.clearAllMocks();
        mockedGeofenceStore.getAll.mockReturnValue(mockGeofences);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders list of geofences", () => {
        renderWithRouter(<GeofencesPanel />, { route: "/geofences" });
        expect(screen.getByText("Test Zone")).toBeInTheDocument();
    });

    it("opens create dialog on Add click", () => {
        renderWithRouter(<GeofencesPanel />, { route: "/geofences" });
        fireEvent.click(screen.getByText("Add"));
        expect(screen.getByText("Create Geofence")).toBeInTheDocument();
    });

    it("calls store.createCircle on create submit", async () => {
        mockedGeofenceStore.getAll.mockReturnValue([]);
        renderWithRouter(<GeofencesPanel />, { route: "/geofences" });

        // Open dialog
        fireEvent.click(screen.getByText("Add"));

        // Fill form
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Zone" } });
        fireEvent.change(screen.getByLabelText("Lat"), { target: { value: "59.5" } });
        fireEvent.change(screen.getByLabelText("Lon"), { target: { value: "24.5" } });
        fireEvent.change(screen.getByLabelText("Radius (m)"), { target: { value: "100" } });

        // Submit
        fireEvent.click(screen.getByText("Create"));

        expect(mockedGeofenceStore.createCircle).toHaveBeenCalledWith(expect.objectContaining({
            name: "New Zone",
            center: { lon: 24.5, lat: 59.5 },
            radiusMeters: 100
        }));

        // Should refresh map
        expect(mapApi.setGeofences).toHaveBeenCalled();
    });

    it("calls store.remove on delete click", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockImplementation(() => true);
        renderWithRouter(<GeofencesPanel />, { route: "/geofences" });

        fireEvent.click(screen.getByText("Delete"));

        expect(mockedGeofenceStore.remove).toHaveBeenCalledWith("1");
        expect(mapApi.setGeofences).toHaveBeenCalled();
        confirmSpy.mockRestore();
    });
});
