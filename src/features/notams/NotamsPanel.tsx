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
import { useSharedNotamStream } from "@/services/streams/StreamsProvider";
import { formatUtcTimestamp } from "@/shared/time/utc";
import { formatAltitude } from "@/shared/units/altitude";
import { StatusPill } from "@/ui/StatusPill";

function formatAge(ageSeconds: number | null) {
  if (ageSeconds === null) return "No updates yet";
  if (ageSeconds < 5) return "Updated just now";
  if (ageSeconds < 60) return `Updated ${ageSeconds}s ago`;
  const minutes = Math.floor(ageSeconds / 60);
  return `Updated ${minutes}m ago`;
}

export function NotamsPanel() {
  const { data, status, ageSeconds, lastOkUtc, error } = useSharedNotamStream();
  const { selectEntity } = useSidebarUrlState();

  const notams = useMemo(() => data ?? [], [data]);
  const subtitle = useMemo(() => formatAge(ageSeconds), [ageSeconds]);

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          NOTAMs
        </Typography>
        <StatusPill status={status} />
        {status === "loading" ? <CircularProgress size={16} /> : null}
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        {lastOkUtc ? (
          <Typography variant="caption" color="text.secondary">
            Last update (UTC): {formatUtcTimestamp(lastOkUtc)}
          </Typography>
        ) : null}
      </Stack>

      {error && status === "error" ? (
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      ) : null}

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, overflow: "auto", flex: 1 }}>
        {notams.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No NOTAMs available right now.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {notams.map((notam, index) => {
              const altitudeText =
                notam.altitudes.length > 0
                  ? notam.altitudes.map((alt) => formatAltitude(alt, { showFeet: true })).join("; ")
                  : "No altitude limits";

              return (
                <React.Fragment key={notam.id}>
                  <ListItemButton
                    alignItems="flex-start"
                    sx={{ py: 1.25, px: 2 }}
                    onClick={() => selectEntity({ kind: "notam", id: notam.id })}
                  >
                    <ListItem alignItems="flex-start" disablePadding sx={{ width: "100%" }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle1">{notam.id}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notam.summary}
                            </Typography>
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              Valid: {formatUtcTimestamp(notam.validFromUtc ?? null)} →{" "}
                              {formatUtcTimestamp(notam.validToUtc ?? null)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {altitudeText}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  </ListItemButton>
                  {index < notams.length - 1 ? <Divider component="li" /> : null}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Stack>
  );
}
