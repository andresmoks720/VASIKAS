import React from "react";
import { Stack, Typography } from "@mui/material";

import { EntityRef } from "@/layout/MapShell/urlState";

export function ObjectDetailsPanel({ entity }: { entity: EntityRef }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h6">Object Details</Typography>
      <Typography variant="body2">Kind: {entity.kind}</Typography>
      <Typography variant="body2">ID: {entity.id}</Typography>
    </Stack>
  );
}
