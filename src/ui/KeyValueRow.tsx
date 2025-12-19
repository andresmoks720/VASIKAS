import React from "react";
import { Stack, Typography } from "@mui/material";

type KeyValueRowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

export function KeyValueRow({ label, value }: KeyValueRowProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 120, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word", flex: 1 }}>
        {value}
      </Typography>
    </Stack>
  );
}
