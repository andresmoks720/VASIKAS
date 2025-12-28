import React, { useMemo, useState } from "react";
import { Alert, Button, Checkbox, Divider, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";

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
import { mapApi } from "@/map/mapApi";
import {
  useSharedAdsbStream,
  useSharedDronesStream,
  useSharedSensorsStream,
  useSharedNotamStream,
} from "@/services/streams/StreamsProvider";
import { NormalizedNotam } from "@/services/notam/notamTypes";
import { EnhancedNotam } from "@/services/airspace/airspaceTypes";

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
  | { kind: "notam"; item: EnhancedNotam | undefined }
  | { kind: EntityRef["kind"]; item: undefined };


export function ObjectDetailsPanel({ entity }: { entity: EntityRef }) {
  const { selectEntity } = useSidebarUrlState();
  const { data: drones } = useSharedDronesStream();
  const { data: sensors } = useSharedSensorsStream();
  const { data: aircraft } = useSharedAdsbStream();
  const { data: notams } = useSharedNotamStream();

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
      case "notam":
        return { kind: entity.kind, item: (notams ?? []).find((notam) => notam.id === entity.id) };
      default:
        return { kind: entity.kind, item: undefined };
    }
  }, [aircraft, drones, entity.id, entity.kind, notams, sensors]);

  const title = useMemo(() => {
    if (!selection.item) return "Object Details";
    if (selection.kind === "aircraft" || selection.kind === "flight") {
      const callsign = (selection.item as Aircraft).callsign;
      return callsign ? `${callsign} Details` : "Airplane Details";
    }
    if (selection.kind === "drone") {
      return `${(selection.item as Drone).label} Details`;
    }
    if (selection.kind === "sensor") {
      return `${(selection.item as Sensor).name} Details`;
    }
    if (selection.kind === "geofence") {
      return `${(selection.item as Geofence).name} Details`;
    }
    if (selection.kind === "notam") {
      return `NOTAM ${selection.item.id}`;
    }
    return "Object Details";
  }, [selection]);

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
        <Typography variant="h6">{title}</Typography>
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
          <KeyValueRow
            label="Last update (UTC)"
            value={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{formatUtcTimestamp(selection.item.ingestTimeUtc)}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => mapApi.centerOnEntity("drone", selection.item!.id)}
                >
                  Center
                </Button>
              </Stack>
            }
          />

          <Divider sx={{ my: 1 }} />
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    mapApi.setFocus("drone", e.target.checked ? selection.item!.id : null)
                  }
                />
              }
              label={<Typography variant="body2">Keep in focus</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    mapApi.setTrackVisibility("drone", selection.item!.id, e.target.checked)
                  }
                />
              }
              label={<Typography variant="body2">Track (Trajectory)</Typography>}
            />
          </Stack>
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
          <KeyValueRow
            label="Last update (UTC)"
            value={
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{formatUtcTimestamp(selection.item.eventTimeUtc)}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => mapApi.centerOnEntity("flight", selection.item!.id)}
                >
                  Center
                </Button>
              </Stack>
            }
          />
          <KeyValueRow label="Ingest time (UTC)" value={formatUtcTimestamp(selection.item.ingestTimeUtc)} />

          <Divider sx={{ my: 1 }} />
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    mapApi.setFocus("flight", e.target.checked ? selection.item!.id : null)
                  }
                />
              }
              label={<Typography variant="body2">Keep in focus</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    mapApi.setTrackVisibility("flight", selection.item!.id, e.target.checked)
                  }
                />
              }
              label={<Typography variant="body2">Track (Trajectory)</Typography>}
            />
          </Stack>
        </Stack>
      ) : null}

      {selection.kind === "geofence" ? (
        <GeofenceDetailsSection geofence={selection.item} />
      ) : null}

      {selection.kind === "notam" ? (
        <NotamDetailsSection notam={selection.item} />
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
  const circleGeometry = geofence.geometry.kind === "circle" ? geofence.geometry : null;
  const [lat, setLat] = useState(circleGeometry ? circleGeometry.center.lat.toString() : "");
  const [lon, setLon] = useState(circleGeometry ? circleGeometry.center.lon.toString() : "");
  const [radius, setRadius] = useState(circleGeometry ? circleGeometry.radiusMeters.toString() : "");
  const [description, setDescription] = useState(geofence.description || "");

  const handleSave = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const radiusNum = parseFloat(radius);

    if (!name) return;

    geofenceStore.update(geofence.id, {
      name,
      description,
      center: circleGeometry ? { lat: latNum, lon: lonNum } : undefined,
      radiusMeters: circleGeometry ? radiusNum : undefined,
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
        {circleGeometry && (
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
        {circleGeometry && (
          <>
            <KeyValueRow
              label="Center"
              value={formatPosition(circleGeometry.center.lon, circleGeometry.center.lat)}
            />
            <KeyValueRow label="Radius" value={`${circleGeometry.radiusMeters} m`} />
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

function NotamDetailsSection({ notam }: { notam: NormalizedNotam }) {
  const altitudes =
    notam.altitudes.length > 0
      ? notam.altitudes.map((alt) => formatAltitude(alt, { showFeet: true }))
      : ["No altitude limits"];

  return (
    <Stack spacing={1}>
      <KeyValueRow label="Summary" value={notam.summary} />
      <KeyValueRow label="Valid from (UTC)" value={formatUtcTimestamp(notam.validFromUtc ?? null)} />
      <KeyValueRow label="Valid to (UTC)" value={formatUtcTimestamp(notam.validToUtc ?? null)} />
      <KeyValueRow label="Event time (UTC)" value={formatUtcTimestamp(notam.eventTimeUtc)} />
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          Altitudes
        </Typography>
        {altitudes.map((altitude) => (
          <Typography key={altitude} variant="body2">
            {altitude}
          </Typography>
        ))}
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" color="text.secondary">
        NOTAM Text
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {notam.text}
      </Typography>
    </Stack>
  );
}
