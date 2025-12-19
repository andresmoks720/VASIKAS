import React from "react";
import { Chip } from "@mui/material";

import { PollingStatus } from "@/services/polling/usePolling";

const LABELS: Record<PollingStatus, string> = {
  idle: "Idle",
  loading: "Loading",
  live: "Live",
  stale: "Stale",
  error: "Error",
};

export function StatusPill({ status }: { status: PollingStatus }) {
  const color: "default" | "error" | "success" | "warning" =
    status === "live"
      ? "success"
      : status === "error"
        ? "error"
        : status === "stale"
          ? "warning"
          : "default";

  return (
    <Chip
      size="small"
      variant={status === "idle" ? "outlined" : "filled"}
      color={color}
      label={LABELS[status]}
      sx={{ textTransform: "uppercase", fontWeight: 600 }}
    />
  );
}
