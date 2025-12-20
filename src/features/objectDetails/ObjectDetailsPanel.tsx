import React, { useMemo } from "react";
import { Alert, Divider, Stack, Typography } from "@mui/material";

import { EntityRef } from "@/layout/MapShell/urlState";
import { Aircraft } from "@/services/adsb/adsbTypes";
import { Drone } from "@/services/drones/droneTypes";
import { Sensor } from "@/services/sensors/sensorsTypes";
import { geofenceStore, Geofence } from "@/services/geofences/geofenceStore";
import { formatUtcTimestamp } from "@/shared/time/utc";
import { formatAltitude } from "@/shared/units/altitude";
import { formatSpeed } from "@/shared/units/speed";
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
      <Alert severity="info" variant="outlined">
        No data found for {entity.kind}:{entity.id}
      </Alert>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Object Details</Typography>
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
        <Stack spacing={1}>
          <KeyValueRow label="Name" value={selection.item.name} />
          <KeyValueRow label="Kind" value={selection.item.kind} />
          <KeyValueRow
            label="Position"
            value={formatPosition(selection.item.position.lon, selection.item.position.lat)}
          />
          <KeyValueRow label="Status" value={selection.item.status} />
          <KeyValueRow label="Last seen (UTC)" value={formatUtcTimestamp(selection.item.lastSeenUtc)} />
          <KeyValueRow label="Ingest time (UTC)" value={formatUtcTimestamp(selection.item.ingestTimeUtc)} />
        </Stack>
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
        <Stack spacing={1}>
          <KeyValueRow label="Name" value={selection.item.name} />
          <KeyValueRow label="Kind" value={selection.item.geometry.kind} />
          {selection.item.geometry.kind === "circle" ? (
            <>
              <KeyValueRow
                label="Center"
                value={formatPosition(selection.item.geometry.center.lon, selection.item.geometry.center.lat)}
              />
              <KeyValueRow label="Radius" value={`${selection.item.geometry.radiusMeters} m`} />
            </>
          ) : null}
          {selection.item.description ? <KeyValueRow label="Description" value={selection.item.description} /> : null}
          <KeyValueRow label="Updated (UTC)" value={formatUtcTimestamp(selection.item.updatedAtUtc)} />
        </Stack>
      ) : null}
    </Stack>

  );
}
