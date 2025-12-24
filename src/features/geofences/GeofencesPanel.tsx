import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,

  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { geofenceStore, Geofence } from "@/services/geofences/geofenceStore";
import { mapApi } from "@/map/mapApi";

export function GeofencesPanel() {
  const { selectEntity } = useSidebarUrlState();
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  // Create Form State
  const [newName, setNewName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLon, setNewLon] = useState("");
  const [newRadius, setNewRadius] = useState("500");

  // Rename State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const refresh = () => {
    const list = geofenceStore.getAll();
    setGeofences([...list]);
    mapApi.setGeofences(list);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = () => {
    const lat = parseFloat(newLat);
    const lon = parseFloat(newLon);
    const r = parseFloat(newRadius);

    if (!newName || isNaN(lat) || isNaN(lon) || isNaN(r)) return;

    geofenceStore.createCircle({
      name: newName,
      center: { lon, lat },
      radiusMeters: r,
    });

    setNewName("");
    setNewLat("");
    setNewLon("");
    setNewRadius("500");
    setIsCreateOpen(false);
    refresh();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this geofence?")) {
      geofenceStore.remove(id);
      refresh();
    }
  };

  const startRename = (g: Geofence, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(g.id);
    setRenameValue(g.name);
    setIsRenameOpen(true);
  };

  const handleRename = () => {
    if (editingId && renameValue) {
      geofenceStore.rename(editingId, renameValue);
      setEditingId(null);
      setRenameValue("");
      setIsRenameOpen(false);
      refresh();
    }
  };

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Geofences</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsCreateOpen(true)}
        >

          Add
        </Button>
      </Stack>

      <Box sx={{ flex: 1, overflow: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
        <List>
          {geofences.map((g) => (
            <ListItem
              key={g.id}
              disablePadding
              sx={{
                mb: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                "&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" },
              }}
              onClick={() => selectEntity({ kind: "geofence", id: g.id })}
              secondaryAction={
                <Stack direction="row">
                  <Button size="small" onClick={(e) => startRename(g, e)} sx={{ minWidth: 0, px: 1 }}>
                    Edit
                  </Button>
                  <Button size="small" onClick={(e) => handleDelete(g.id, e)} color="error" sx={{ minWidth: 0, px: 1 }}>
                    Delete
                  </Button>
                </Stack>
              }

            >
              <Box sx={{ p: 2, width: "100%" }}>
                <ListItemText
                  primary={g.name}
                  secondary={
                    g.geometry.kind === "circle"
                      ? `Circle (r=${g.geometry.radiusMeters}m)`
                      : "Polygon"
                  }
                />
              </Box>
            </ListItem>
          ))}
          {geofences.length === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No geofences created yet.
              </Typography>
            </Box>
          )}
        </List>
      </Box>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <DialogTitle>Create Geofence</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              autoFocus
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Lat"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                fullWidth
              />
              <TextField
                label="Lon"
                value={newLon}
                onChange={(e) => setNewLon(e.target.value)}
                fullWidth
              />
            </Stack>
            <TextField
              label="Radius (m)"
              value={newRadius}
              onChange={(e) => setNewRadius(e.target.value)}
              fullWidth
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!newName || !newLat || !newLon}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onClose={() => setIsRenameOpen(false)}>
        <DialogTitle>Rename Geofence</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRename} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
