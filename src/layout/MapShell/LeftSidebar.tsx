import React from "react";
import { Box } from "@mui/material";

import { AirTrafficPanel } from "@/features/air/AirTrafficPanel";
import { GeofencesPanel } from "@/features/geofences/GeofencesPanel";
import { HistoryPanel } from "@/features/history/HistoryPanel";
import { KnownDronesPanel } from "@/features/known-drones/KnownDronesPanel";
import { NotamsPanel } from "@/features/notams/NotamsPanel";
import { ObjectDetailsPanel } from "@/features/objectDetails/ObjectDetailsPanel";
import { SensorsPanel } from "@/features/sensors/SensorsPanel";
import { EntityRef, Tool } from "./urlState";

type LeftSidebarProps = {
  tool: Tool;
  entity: EntityRef | null;
  historyDate: string | null;
  historyArea: string | null;
};

export function LeftSidebar({ tool, entity, historyArea, historyDate }: LeftSidebarProps) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {entity ? (
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <ObjectDetailsPanel entity={entity} />
        </Box>
      ) : (
        <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <SidebarPanel tool={tool} historyArea={historyArea} historyDate={historyDate} />
        </Box>
      )}
    </Box>
  );
}

function SidebarPanel({
  tool,
  historyArea,
  historyDate,
}: {
  tool: Tool;
  historyDate: string | null;
  historyArea: string | null;
}) {
  switch (tool) {
    case "airplanes":
      return <AirTrafficPanel />;
    case "sensors":
      return <SensorsPanel />;
    case "geofences":
      return <GeofencesPanel />;
    case "notams":
      return <NotamsPanel />;
    case "drones":
      return <KnownDronesPanel />;
    case "history":
      return <HistoryPanel historyArea={historyArea} historyDate={historyDate} />;
    default:
      return <AirTrafficPanel />;
  }
}
