import React from "react";
import { Box } from "@mui/material";

import { AirTrafficPanel } from "@/features/air/AirTrafficPanel";
import { GeofencesPanel } from "@/features/geofences/GeofencesPanel";
import { HistoryPanel } from "@/features/history/HistoryPanel";
import { KnownDronesPanel } from "@/features/known-drones/KnownDronesPanel";
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
    <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
      {entity ? (
        <ObjectDetailsPanel entity={entity} />
      ) : (
        <SidebarPanel tool={tool} historyArea={historyArea} historyDate={historyDate} />
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
    case "air":
      return <AirTrafficPanel />;
    case "sensors":
      return <SensorsPanel />;
    case "geofences":
      return <GeofencesPanel />;
    case "known-drones":
      return <KnownDronesPanel />;
    case "history":
      return <HistoryPanel historyArea={historyArea} historyDate={historyDate} />;
    default:
      return <AirTrafficPanel />;
  }
}
