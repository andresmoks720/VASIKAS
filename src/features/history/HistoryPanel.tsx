import React from "react";
import { Stack, Typography } from "@mui/material";

export function HistoryPanel({
  historyDate,
  historyArea,
}: {
  historyDate: string | null;
  historyArea: string | null;
}) {
  return (
    <Stack spacing={1} sx={{ flex: 1, overflowY: "auto" }}>
      <Typography variant="h6">History</Typography>
      {historyDate && <Typography variant="body2">Date: {historyDate}</Typography>}
      {historyArea && <Typography variant="body2">Area: {historyArea}</Typography>}
    </Stack>
  );
}
