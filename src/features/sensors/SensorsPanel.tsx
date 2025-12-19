import React, { useMemo } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { useSensorsStream } from "@/services/sensors/sensorsClient";
import { StatusPill } from "@/ui/StatusPill";

function formatAge(ageSeconds: number | null) {
  if (ageSeconds === null) return "No updates yet";
  if (ageSeconds < 5) return "Updated just now";
  if (ageSeconds < 60) return `Updated ${ageSeconds}s ago`;
  const minutes = Math.floor(ageSeconds / 60);
  return `Updated ${minutes}m ago`;
}

export function SensorsPanel() {
  const { data, status, ageSeconds, error } = useSensorsStream();
  const { selectEntity } = useSidebarUrlState();
  const sensors = data ?? [];
  const subtitle = useMemo(() => formatAge(ageSeconds), [ageSeconds]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sensors
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
        {sensors.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No sensors reported yet.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {sensors.map((sensor, index) => (
              <React.Fragment key={sensor.id}>
                <ListItemButton
                  alignItems="flex-start"
                  sx={{ py: 1.25, px: 2 }}
                  onClick={() => selectEntity({ kind: "sensor", id: sensor.id })}
                >
                  <ListItem alignItems="flex-start" disablePadding sx={{ width: "100%" }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1">{sensor.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {sensor.id}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Kind: {sensor.kind} — Status: {sensor.status}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Position: {sensor.position.lon.toFixed(4)}, {sensor.position.lat.toFixed(4)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Coverage: {sensor.coverage.radiusMeters} m radius
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </ListItemButton>
                {index < sensors.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Stack>
  );
}
