import React, { useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  ListItemButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { useDronesStream } from "@/services/drones/droneClient";
import { StatusPill } from "@/ui/StatusPill";

function formatAge(ageSeconds: number | null) {
  if (ageSeconds === null) {
    return "No updates yet";
  }

  if (ageSeconds < 5) {
    return "Updated just now";
  }

  if (ageSeconds < 60) {
    return `Updated ${ageSeconds}s ago`;
  }

  const minutes = Math.floor(ageSeconds / 60);
  return `Updated ${minutes}m ago`;
}

export function KnownDronesPanel() {
  const { data, status, ageSeconds, error } = useDronesStream();
  const { selectEntity } = useSidebarUrlState();
  const drones = data ?? [];

  const subtitle = useMemo(() => formatAge(ageSeconds), [ageSeconds]);

  return (
    <Stack spacing={2} sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Known Drones
        </Typography>
        <StatusPill status={status} />
        {status === "loading" ? <CircularProgress size={16} /> : null}
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>

      {error && status === "error" ? (
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      ) : null}

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, overflow: "hidden", flex: 1 }}>
        {drones.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No drones reported yet.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {drones.map((drone, index) => (
              <React.Fragment key={drone.id}>
                <ListItemButton
                  alignItems="flex-start"
                  sx={{ py: 1.25, px: 2 }}
                  onClick={() => selectEntity({ kind: "drone", id: drone.id })}
                >
                  <ListItem alignItems="flex-start" disablePadding sx={{ width: "100%" }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1">{drone.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {drone.id}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Lon/Lat: {drone.position.lon.toFixed(4)}, {drone.position.lat.toFixed(4)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Altitude: {drone.altitude.meters ?? "?"} m — {drone.altitude.ref} ({drone.altitude.source})
                            {drone.altitude.comment ? ` — ${drone.altitude.comment}` : ""}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Last update: {drone.ingestTimeUtc}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </ListItemButton>
                {index < drones.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Stack>
  );
}
