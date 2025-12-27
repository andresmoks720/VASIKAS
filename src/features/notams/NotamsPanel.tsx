import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { useNotamMode } from "@/services/notam/notamMode";
import { useEnhancedNotamStream } from "@/services/notam/useEnhancedNotamStream";
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
  const { data, status, ageSeconds, lastOkUtc, error, rawCount, displayedCount, dataSource, liveError } =
    useEnhancedNotamStream();
  const { selectEntity } = useSidebarUrlState();
  const { useLiveNotams, toggleUseLiveNotams } = useNotamMode();
  const [toggleNotice, setToggleNotice] = useState<"live" | "mock" | null>(null);

  const notams = useMemo(() => data ?? [], [data]);
  const subtitle = useMemo(() => formatAge(ageSeconds), [ageSeconds]);
  const dataSourceLabel = useMemo(() => {
    if (dataSource === "fallback") {
      return "Mock (live fallback)";
    }
    if (dataSource === "live") {
      return "Live";
    }
    if (dataSource === "mock") {
      return "Mock";
    }
    return useLiveNotams ? "Live" : "Mock";
  }, [dataSource, useLiveNotams]);
  const showErrorIndicator = status === "error" || error !== null || dataSource === "fallback";

  const handleToggle = () => {
    const nextUseLive = !useLiveNotams;
    toggleUseLiveNotams();
    setToggleNotice(nextUseLive ? "live" : "mock");
  };

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          NOTAMs
        </Typography>
        {showErrorIndicator ? (
          <Box
            component="span"
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "error.main",
            }}
          />
        ) : null}
        <Typography variant="caption" color="text.secondary">
          {dataSourceLabel}
        </Typography>
        <Button size="small" variant="outlined" onClick={handleToggle} sx={{ textTransform: "none" }}>
          {useLiveNotams ? "Switch to Mock" : "Switch to Live"}
        </Button>
        <StatusPill status={status} label={status === "live" ? (useLiveNotams ? "Live" : "Mock") : undefined} />
        {status === "loading" ? <CircularProgress size={16} /> : null}
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Total: {rawCount ?? "—"} • Displayed: {displayedCount ?? notams.length}
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
      {!error && dataSource === "fallback" ? (
        <Alert severity="warning" variant="outlined">
          Live NOTAM fetch failed{liveError?.message ? `: ${liveError.message}` : "."} Showing mock
          data instead.
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
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="body2" color="text.secondary">
                                Valid: {formatUtcTimestamp(notam.validFromUtc ?? null)} →{" "}
                                {formatUtcTimestamp(notam.validToUtc ?? null)}
                              </Typography>
                              {/* Visualization status indicator */}
                              {notam.geometryParseReason ? (
                                <Chip
                                  label={notam.geometryParseReason}
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{ height: '20px' }}
                                />
                              ) : 'geometrySource' in notam ? (
                                // Enhanced NOTAM with geometry source
                                <Chip
                                  label={notam.geometrySource.toUpperCase()}
                                  size="small"
                                  color={
                                    notam.geometrySource === 'eAIP' ? 'success' :
                                    notam.geometrySource === 'parsed' ? 'info' : 'warning'
                                  }
                                  variant="outlined"
                                  sx={{ height: '20px' }}
                                />
                              ) : notam.geometry ? (
                                <Chip
                                  label="VISUALIZED"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ height: '20px' }}
                                />
                              ) : (
                                <Chip
                                  label="NO GEOMETRY"
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{ height: '20px' }}
                                />
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {altitudeText}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                whiteSpace: "pre-wrap",
                                mt: 0.5,
                                fontSize: "0.7rem",
                                fontFamily: "monospace",
                              }}
                            >
                              {notam.text}
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
      <Snackbar
        open={toggleNotice !== null}
        autoHideDuration={3000}
        onClose={() => setToggleNotice(null)}
      >
        <Alert severity="info" variant="filled" onClose={() => setToggleNotice(null)}>
          {toggleNotice === "live" ? "Switched to LIVE NOTAM data" : "Switched to MOCK NOTAM data"}
        </Alert>
      </Snackbar>
    </Stack >
  );
}
