import React, { useMemo, useState } from "react";
import { Alert, Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";

import { EntityRef } from "@/layout/MapShell/urlState";
import { useSidebarUrlState } from "@/layout/MapShell/useSidebarUrlState";
import { Aircraft } from "@/services/adsb/adsbTypes";
import { Drone } from "@/services/drones/droneTypes";
import { Sensor } from "@/services/sensors/sensorsTypes";
import { geofenceStore, Geofence } from "@/services/geofences/geofenceStore";
import { formatUtcTimestamp } from "@/shared/time/utc";
import { formatAltitude } from "@/shared/units/altitude";
import { formatSpeed } from "@/shared/units/speed";
import { sensorStore } from "@/services/sensors/sensorStore";
import { KeyValueRow } from "@/ui/KeyValueRow";
import {
  useSharedAdsbStream,
  useSharedDronesStream,
  useSharedSensorsStream,
} from "@/services/streams/StreamsProvider";

const formatPosition = (lon?: number, lat?: number) => {
  if (lon == null || lat == null) {
    return "Unknown position";
  }
  return `${lon.toFixed(4)}, ${lat.toFixed(4)}`;
};

type Selection =
  | { kind: "drone"; item: Drone | undefined }
  | { kind: "sensor"; item: Sensor | undefined }
  | { kind: "geofence"; item: Geofence | undefined }
  | { kind: "aircraft" | "flight"; item: Aircraft | undefined }
  | { kind: EntityRef["kind"]; item: undefined };


export function ObjectDetailsPanel({ entity }: { entity: EntityRef }) {
  const { selectEntity } = useSidebarUrlState();
  const { data: drones } = useSharedDronesStream();
  const { data: sensors } = useSharedSensorsStream();
  const { data: aircraft } = useSharedAdsbStream();

  const selection: Selection = useMemo(() => {
    switch (entity.kind) {
      case "drone":
        return { kind: entity.kind, item: (drones ?? []).find((drone) => drone.id === entity.id) };
      case "sensor":
        return { kind: entity.kind, item: (sensors ?? []).find((sensor) => sensor.id === entity.id) };
      case "aircraft":
      case "flight":
        return { kind: entity.kind, item: (aircraft ?? []).find((flight) => flight.id === entity.id) };
      case "geofence":
        return { kind: entity.kind, item: geofenceStore.getById(entity.id) };
      default:
        return { kind: entity.kind, item: undefined };
    }
  }, [aircraft, drones, entity.id, entity.kind, sensors]);

  if (!selection.item) {
    return (
      <Stack spacing={2}>
        <Button
          onClick={() => selectEntity(null)}
          sx={{ alignSelf: "flex-start" }}
        >
          ← Back
        </Button>
        <Alert severity="info" variant="outlined">
          No data found for {entity.kind}:{entity.id}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={() => selectEntity(null)} size="small">
          <Typography sx={{ fontSize: "1.2rem", lineHeight: 1 }}>←</Typography>
        </IconButton>
        <Typography variant="h6">Object Details</Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        {selection.kind}:{entity.id}
      </Typography>

      <Divider />

      {selection.kind === "drone" ? (
        <Stack spacing={1}>
          <KeyValueRow label="Label" value={selection.item.label} />
          <KeyValueRow
            label="Position"
            value={formatPosition(selection.item.position.lon, selection.item.position.lat)}
          />
          <KeyValueRow label="Altitude" value={formatAltitude(selection.item.altitude, { showFeet: false })} />
          <KeyValueRow label="Speed" value={formatSpeed(selection.item.speedMps, "mps")} />
          <KeyValueRow label="Heading" value={`${selection.item.headingDeg}°`} />
          <KeyValueRow label="Event time (UTC)" value={formatUtcTimestamp(selection.item.eventTimeUtc)} />
          <KeyValueRow label="Ingest time (UTC)" value={formatUtcTimestamp(selection.item.ingestTimeUtc)} />
        </Stack>
      ) : null}

      {selection.kind === "sensor" ? (
        <SensorDetailsSection sensor={selection.item} />
      ) : null}

      {(selection.kind === "aircraft" || selection.kind === "flight") ? (
        <Stack spacing={1}>
          <KeyValueRow label="Hex" value={selection.item.id} />
          <KeyValueRow label="Callsign" value={selection.item.callsign} />
          {selection.item.registration ? <KeyValueRow label="Registration" value={selection.item.registration} /> : null}
          {selection.item.aircraftType ? <KeyValueRow label="Type" value={selection.item.aircraftType} /> : null}
          <KeyValueRow
            label="Position"
            value={formatPosition(selection.item.position.lon, selection.item.position.lat)}
          />
          <KeyValueRow label="Track" value={selection.item.trackDeg != null ? `${selection.item.trackDeg}°` : "—"} />
          {selection.item.altitude ? (
            <KeyValueRow label="Altitude" value={formatAltitude(selection.item.altitude, { showFeet: true })} />
          ) : null}
          {selection.item.groundSpeedKmh ? (
            <KeyValueRow label="Ground speed" value={formatSpeed(selection.item.groundSpeedKmh, "kmh")} />
          ) : null}
          <KeyValueRow label="Last position update (UTC)" value={formatUtcTimestamp(selection.item.eventTimeUtc)} />
          <KeyValueRow label="Ingest time (UTC)" value={formatUtcTimestamp(selection.item.ingestTimeUtc)} />
        </Stack>
      ) : null}

      {selection.kind === "geofence" ? (
        <GeofenceDetailsSection geofence={selection.item} />
      ) : null}
    </Stack>

  );
}

function SensorDetailsSection({ sensor }: { sensor: Sensor }) {
  const { selectEntity } = useSidebarUrlState();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(sensor.name);
  const [lat, setLat] = useState(sensor.position.lat.toString());
  const [lon, setLon] = useState(sensor.position.lon.toString());

  const handleSave = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (!name || isNaN(latNum) || isNaN(lonNum)) return;

    sensorStore.update(sensor.id, {
      name,
      position: { lat: latNum, lon: lonNum },
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this sensor?")) {
      sensorStore.remove(sensor.id);
      selectEntity(null);
    }
  };

  if (isEditing) {
    return (
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            fullWidth
            size="small"
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" size="small" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <KeyValueRow label="Name" value={sensor.name} />
        <KeyValueRow label="Kind" value={sensor.kind} />
        <KeyValueRow
          label="Position"
          value={formatPosition(sensor.position.lon, sensor.position.lat)}
        />
        <KeyValueRow label="Status" value={sensor.status} />
        <KeyValueRow label="Last seen (UTC)" value={formatUtcTimestamp(sensor.lastSeenUtc)} />
      </Stack>

      <Divider />

      {sensor.source === "user" && (
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="outlined" size="small" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
function GeofenceDetailsSection({ geofence }: { geofence: Geofence }) {
  const { selectEntity } = useSidebarUrlState();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(geofence.name);
  const isCircle = geofence.geometry.kind === "circle";
  const [lat, setLat] = useState(isCircle ? (geofence.geometry as any).center.lat.toString() : "");
  const [lon, setLon] = useState(isCircle ? (geofence.geometry as any).center.lon.toString() : "");
  const [radius, setRadius] = useState(isCircle ? (geofence.geometry as any).radiusMeters.toString() : "");
  const [description, setDescription] = useState(geofence.description || "");

  const handleSave = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const radiusNum = parseFloat(radius);

    if (!name) return;

    geofenceStore.update(geofence.id, {
      name,
      description,
      center: isCircle ? { lat: latNum, lon: lonNum } : undefined,
      radiusMeters: isCircle ? radiusNum : undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this geofence?")) {
      geofenceStore.remove(geofence.id);
      selectEntity(null);
    }
  };

  if (isEditing) {
    return (
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />
        {isCircle && (
          <>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Longitude"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                fullWidth
                size="small"
              />
            </Stack>
            <TextField
              label="Radius (m)"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              fullWidth
              size="small"
              type="number"
            />
          </>
        )}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          size="small"
          multiline
          rows={2}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" size="small" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" size="small" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <KeyValueRow label="Name" value={geofence.name} />
        <KeyValueRow label="Kind" value={geofence.geometry.kind} />
        {isCircle && (
          <>
            <KeyValueRow
              label="Center"
              value={formatPosition((geofence.geometry as any).center.lon, (geofence.geometry as any).center.lat)}
            />
            <KeyValueRow label="Radius" value={`${(geofence.geometry as any).radiusMeters} m`} />
          </>
        )}
        {geofence.description ? <KeyValueRow label="Description" value={geofence.description} /> : null}
        <KeyValueRow label="Updated (UTC)" value={formatUtcTimestamp(geofence.updatedAtUtc)} />
      </Stack>

      <Divider />

      <Stack direction="row" spacing={1}>
        <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Stack>
    </Stack>
  );
}
