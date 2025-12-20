import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

import { MapView } from "@/map/MapView";
import { TOOLS, Tool } from "./urlState";
import { LeftSidebar } from "./LeftSidebar";
import { useSidebarUrlState } from "./useSidebarUrlState";
import { StreamsProvider } from "@/services/streams/StreamsProvider";

const SIDEBAR_WIDTH = 360;

function ToolNavButton({
  tool,
  currentTool,
  onSelect,
}: {
  tool: Tool;
  currentTool: Tool;
  onSelect: (tool: Tool) => void;
}) {
  const isActive = tool === currentTool;

  return (
    <Button
      color={isActive ? "primary" : "inherit"}
      onClick={() => onSelect(tool)}
      sx={{ textTransform: "capitalize" }}
    >
      {tool.replace("-", " ")}
    </Button>
  );
}

export function MapShell() {
  const { tool, entity, historyArea, historyDate, setTool, selectEntity } =
    useSidebarUrlState();

  return (
    <StreamsProvider>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ gap: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Virtual Airspace Surveillance Interface for Key Area Security
            </Typography>
            {TOOLS.map((toolName) => (
              <ToolNavButton
                key={toolName}
                tool={toolName}
                currentTool={tool}
                onSelect={setTool}
              />
            ))}
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            display: "grid",
            gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
            minHeight: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              borderRight: 1,
              borderColor: "divider",
              height: "100%",
              minWidth: SIDEBAR_WIDTH,
            }}
          >
            <LeftSidebar
              tool={tool}
              entity={entity}
              historyArea={historyArea}
              historyDate={historyDate}
            />
          </Box>

          <Box sx={{ height: "100%" }}>
            <MapView
              selectedEntity={entity}
              onSelectEntity={(next) => selectEntity(next, { replace: true })}
            />
          </Box>
        </Box>
      </Box>
    </StreamsProvider>
  );
}
