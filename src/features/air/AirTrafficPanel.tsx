import React, { useMemo } from "react";
import {
  Alert,
  Box,
  Button,
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
import { formatAltitude } from "@/shared/units/altitude";
import { formatAircraftSpeedKmh } from "@/shared/units/speed";
import { StatusPill } from "@/ui/StatusPill";
import { useSharedAdsbStream } from "@/services/streams/StreamsProvider";
import { PollingStatus } from "@/services/polling/usePolling";
import { formatUpdateAge } from "@/shared/time/updateAge";
import { useAdsbMode } from "@/services/adsb/adsbMode";

export function AirTrafficPanel() {
  const { data, status, ageSeconds, error } = useSharedAdsbStream();
  const { useLiveAdsb, toggleUseLiveAdsb } = useAdsbMode();
  const { selectEntity } = useSidebarUrlState();
  const nowMs = Date.now();
  const flights = useMemo(() => {
    return (data ?? [])
      .map((flight) => {
        const eventMs = flight.eventTimeUtc ? Date.parse(flight.eventTimeUtc) : NaN;
        const age = Number.isFinite(eventMs) ? Math.max(0, Math.floor((nowMs - eventMs) / 1000)) : null;
        return { flight, age };
      })
      .sort((a, b) => {
        const callsignA = a.flight.callsign || "";
        const callsignB = b.flight.callsign || "";
        if (a.age === null && b.age === null) return callsignA.localeCompare(callsignB);
        if (a.age === null) return 1;
        if (b.age === null) return -1;
        if (a.age !== b.age) return a.age - b.age;
        return callsignA.localeCompare(callsignB);
      });
  }, [data, nowMs]);

  const subtitle = useMemo(() => formatUpdateAge(ageSeconds), [ageSeconds]);

  const statusLabel = (pollingStatus: PollingStatus, age: number | null) => {
    if (pollingStatus === "error") return "Error";
    if (pollingStatus === "stale") return "Stale";
    if (age === null) return "Unknown";
    return formatUpdateAge(age);
  };

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Airplanes{" "}
          <Typography component="span" variant="caption" sx={{ opacity: 0.7 }}>
            – {useLiveAdsb ? "Live API" : "Mock Data"}
          </Typography>
        </Typography>
        <Button size="small" variant="outlined" onClick={toggleUseLiveAdsb} sx={{ textTransform: "none" }}>
          {useLiveAdsb ? "Switch to Mock" : "Switch to Live"}
        </Button>
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

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1, overflow: "auto", flex: 1 }}>
        {flights.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No aircraft visible right now.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {flights.map(({ flight, age }, index) => (
              <React.Fragment key={flight.id}>
                <ListItemButton
                  alignItems="flex-start"
                  sx={{ py: 1.25, px: 2 }}
                  onClick={() => selectEntity({ kind: "flight", id: flight.id })}
                >
                  <ListItem alignItems="flex-start" disablePadding sx={{ width: "100%" }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1">{flight.callsign}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {flight.id}
                          </Typography>
                        </Stack>
                      }
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            Position: {flight.position ? `${flight.position.lon.toFixed(4)}, ${flight.position.lat.toFixed(4)}` : "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Altitude: {flight.altitude ? formatAltitude(flight.altitude, { showFeet: true }) : "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Ground speed: {formatAircraftSpeedKmh(flight.groundSpeedKmh)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {statusLabel(status, age)}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </ListItemButton>
                {index < flights.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Stack>
  );
}
