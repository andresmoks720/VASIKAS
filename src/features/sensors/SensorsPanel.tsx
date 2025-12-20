import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { StatusPill } from "@/ui/StatusPill";
import { useSharedSensorsStream } from "@/services/streams/StreamsProvider";
import { sensorStore } from "@/services/sensors/sensorStore";
import { Sensor } from "@/services/sensors/sensorsTypes";

function formatAge(ageSeconds: number | null) {
  if (ageSeconds === null) return "No updates yet";
  if (ageSeconds < 5) return "Updated just now";
  if (ageSeconds < 60) return `Updated ${ageSeconds}s ago`;
  const minutes = Math.floor(ageSeconds / 60);
  return `Updated ${minutes}m ago`;
}

type AddSensorDialogProps = {
  open: boolean;
  onClose: () => void;
};

function AddSensorDialog({ open, onClose }: AddSensorDialogProps) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("radar");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const handleCreate = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (!name || isNaN(latNum) || isNaN(lonNum)) {
      return;
    }

    sensorStore.create({
      name,
      kind,
      position: { lat: latNum, lon: lonNum },
    });
    onClose();
    setName("");
    setLat("");
    setLon("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Sensor</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
          <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Kind" fullWidth value={kind} onChange={(e) => setKind(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <TextField label="Latitude" fullWidth value={lat} onChange={(e) => setLat(e.target.value)} />
            <TextField label="Longitude" fullWidth value={lon} onChange={(e) => setLon(e.target.value)} />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function SensorsPanel() {
  const { data, status, ageSeconds, error } = useSharedSensorsStream();
  const { selectEntity } = useSidebarUrlState();
  const sensors = data ?? [];
  const subtitle = useMemo(() => formatAge(ageSeconds), [ageSeconds]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { baseSensors, userSensors } = useMemo(() => {
    return {
      baseSensors: sensors.filter((s) => s.source === "base"),
      userSensors: sensors.filter((s) => s.source === "user"),
    };
  }, [sensors]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this sensor?")) {
      sensorStore.remove(id);
    }
  };

  return (
    <Stack spacing={2} sx={{ height: "100%" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sensors
        </Typography>
        <StatusPill status={status} />
        {status === "loading" ? <CircularProgress size={16} /> : null}
        <Button size="small" variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>

      {error && status === "error" ? (
        <Alert severity="error" variant="outlined">
          {error.message}
        </Alert>
      ) : null}

      <Box sx={{ flex: 1, overflowY: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
        {sensors.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No sensors available.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {userSensors.length > 0 && (
              <>
                <ListItem sx={{ bgcolor: "action.hover" }}>
                  <Typography variant="overline">User Sensors</Typography>
                </ListItem>
                {userSensors.map((sensor) => (
                  <React.Fragment key={sensor.id}>
                    <SensorRow
                      sensor={sensor}
                      onClick={() => selectEntity({ kind: "sensor", id: sensor.id })}
                      onDelete={(e) => handleDelete(e, sensor.id)}
                    />
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </>
            )}

            {baseSensors.length > 0 && (
              <>
                <ListItem sx={{ bgcolor: "action.hover" }}>
                  <Typography variant="overline">Base Sensors</Typography>
                </ListItem>
                {baseSensors.map((sensor, index) => (
                  <React.Fragment key={sensor.id}>
                    <SensorRow sensor={sensor} onClick={() => selectEntity({ kind: "sensor", id: sensor.id })} />
                    {index < baseSensors.length - 1 ? <Divider component="li" /> : null}
                  </React.Fragment>
                ))}
              </>
            )}
          </List>
        )}
      </Box>

      <AddSensorDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} />
    </Stack>
  );
}

function SensorRow({
  sensor,
  onClick,
  onDelete,
}: {
  sensor: Sensor;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}) {
  return (
    <ListItemButton alignItems="flex-start" sx={{ py: 1.25, px: 2 }} onClick={onClick}>
      <ListItem alignItems="flex-start" disablePadding sx={{ width: "100%" }}>
        <ListItemText
          primary={
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle1">{sensor.name}</Typography>
              {onDelete && (
                <Button size="small" color="error" onClick={onDelete} sx={{ ml: "auto", minWidth: 0 }}>
                  Delete
                </Button>
              )}
            </Stack>
          }
          secondary={
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                {sensor.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sensor.kind} — {sensor.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sensor.position.lon.toFixed(4)}, {sensor.position.lat.toFixed(4)}
              </Typography>
            </Stack>
          }
        />
      </ListItem>
    </ListItemButton>
  );
}
