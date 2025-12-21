import React, { useEffect, useMemo, useRef } from "react";
import { Alert, Box, Checkbox, FormControlLabel, IconButton, Stack, Typography } from "@mui/material";
import Feature from "ol/Feature";
import OlMap from "ol/Map";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { Circle as CircleStyle, Fill, RegularShape, Stroke, Style } from "ol/style";

import { createOfflineXyzLayer } from "./layers/offlineXyz";
import { createMaaAmetOrthoLayer } from "./layers/maaAmetOrthoWmts";
import { to3857, to4326 } from "./transforms";
import { EntityRef } from "@/layout/MapShell/urlState";
import { ENV } from "@/shared/env";
import { useSharedAdsbStream, useSharedDronesStream, useSharedSensorsStream } from "@/services/streams/StreamsProvider";
import { createGeofenceLayer } from "./layers/geofences";
import { createNotamLayer } from "./layers/notams";
import { mapApi } from "./mapApi";
import { geofenceStore } from "@/services/geofences/geofenceStore";
import { Polygon, Circle as CircleGeom } from "ol/geom";
import { fromCircle } from "ol/geom/Polygon";
import { NormalizedNotam, NotamGeometry } from "@/services/notam/notamTypes";


const ESTONIA_CENTER_LON_LAT: [number, number] = [25.1122, 58.5648]; // Match new ADS-B default center
const DEFAULT_ZOOM = 7.5;

// Shared view singleton to maintain state across remounts/tool switches
const sharedView = new View({
  projection: "EPSG:3857",
  center: to3857(ESTONIA_CENTER_LON_LAT),
  zoom: DEFAULT_ZOOM,
});

/**
 * Converts NormalizedNotam geometry (WGS-84) to OpenLayers geometry (EPSG:3857).
 * Returns null if geometry is null or cannot be converted.
 */
function notamGeometryToOl(geometry: NotamGeometry): Polygon | null {
  if (!geometry) return null;

  if (geometry.kind === "circle") {
    // Create circle from center point and radius
    const center3857 = to3857(geometry.center);
    // OL Circle requires coordinates in the projection units (meters for 3857)
    const circle = new CircleGeom(center3857, geometry.radiusMeters);
    // Convert circle to polygon for consistent rendering
    return fromCircle(circle, 64); // 64 sides for smooth circle
  }

  if (geometry.kind === "polygon") {
    // coordinates is GeoJSON format: [[[lon, lat], [lon, lat], ...]]
    // Transform each ring to EPSG:3857
    const rings = geometry.coordinates.map((ring) =>
      ring.map((coord) => to3857(coord))
    );
    return new Polygon(rings);
  }

  return null;
}

import { Tool } from "@/layout/MapShell/urlState";

type MapViewProps = {
  tool: Tool;
  selectedEntity: EntityRef | null;
  onSelectEntity: (entity: EntityRef) => void;
};

declare global {
  interface Window {
    __debugMap?: {
      getFeaturePosition: (kind: EntityRef["kind"], id: string) => [number, number] | null;
    };
  }
}

const ESTONIA_CENTER: [number, number] = [25.013, 58.595];
const ESTONIA_ZOOM = 7.2;

export function MapView({ tool, selectedEntity, onSelectEntity }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<OlMap | null>(null);
  const sensorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const adsbLayerRef = useRef<VectorLayer<VectorSource> | null>(null);



  const droneLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const geofenceLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const notamLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const { data: sensors } = useSharedSensorsStream();
  const { data: aircraft, tracks: adsbTracks } = useSharedAdsbStream();
  const { data: drones } = useSharedDronesStream();

  const selectedRef = useRef<EntityRef | null>(selectedEntity);
  selectedRef.current = selectedEntity;

  const onSelectEntityRef = useRef(onSelectEntity);
  onSelectEntityRef.current = onSelectEntity;
  const [focusedEntity, setFocusedEntity] = React.useState<{ kind: EntityRef["kind"]; id: string } | null>(null);
  const [visibleTracks, setVisibleTracks] = React.useState<Set<string>>(new Set());

  const isSelected = useMemo(
    () => (kind: EntityRef["kind"], id: string) => {
      const sel = selectedRef.current;
      if (!sel) return false;
      if (
        (sel.kind === "aircraft" || sel.kind === "flight") &&
        (kind === "aircraft" || kind === "flight") &&
        sel.id === id
      ) {
        return true;
      }

      return sel.kind === kind && sel.id === id;
    },
    [],
  );

  const useMocks = ENV.useMocks();

  const baseLayer = useMemo(() => {
    const wmtsLayer = createMaaAmetOrthoLayer(ENV.mapWmtsUrl());
    if (wmtsLayer) {
      return wmtsLayer;
    }

    return new TileLayer({ source: new OSM() });
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const sensorSource = new VectorSource();
    const sensorLayer = new VectorLayer({
      source: sensorSource,
      style: (feature) => {
        const isCoverage = feature.get("isCoverage") === true;
        const sensorId = String(feature.getId() ?? "").replace("-coverage", "");
        const selected = selectedEntity?.kind === "sensor" && selectedEntity?.id === sensorId;

        if (isCoverage) {
          return new Style({
            stroke: new Stroke({
              color: "#2196f3",
              width: 1,
              lineDash: [4, 4],
            }),
            fill: new Fill({
              color: "rgba(33, 150, 243, 0.15)",
            }),
          });
        }

        return new Style({
          image: new CircleStyle({
            radius: selected ? 8 : 6,
            fill: new Fill({ color: selected ? "#1565c0" : "#2196f3" }),
            stroke: new Stroke({ color: "#0d47a1", width: selected ? 3 : 2 }),
          }),
        });
      },
    });

    const adsbSource = new VectorSource();
    const adsbLayer = new VectorLayer({
      source: adsbSource,
      style: (feature) => {
        const isTrack = feature.getGeometry() instanceof LineString;
        const flightId = feature.get("flightId") as string | undefined;
        // Check selection directly from the current prop during render
        const selected = flightId && selectedEntity?.kind === "flight" && selectedEntity?.id === flightId;

        if (isTrack) {
          return new Style({
            stroke: new Stroke({ color: selected ? "#e65100" : "#ff9800", width: selected ? 3 : 2 }),
          });
        }

        const trackDeg = feature.get("trackDeg") as number | null | undefined;
        const rotation = ((trackDeg ?? 0) * Math.PI) / 180;
        return new Style({
          image: new RegularShape({
            points: 3,
            radius: selected ? 10 : 8,
            rotation,
            fill: new Fill({ color: selected ? "#ef6c00" : "#ff9800" }),
            stroke: new Stroke({ color: selected ? "#e65100" : "#b26a00", width: selected ? 3 : 2 }),
          }),
        });
      },
    });

    const droneSource = new VectorSource();
    const droneLayer = new VectorLayer({
      source: droneSource,
      style: (feature) => {
        const droneId = String(feature.getId() ?? "");
        const selected = selectedEntity?.kind === "drone" && selectedEntity?.id === droneId;
        return new Style({
          image: new CircleStyle({
            radius: selected ? 9 : 7,
            fill: new Fill({ color: selected ? "#2e7d32" : "#4caf50" }),
            stroke: new Stroke({ color: "#1b5e20", width: selected ? 3 : 2 }),
          }),
        });
      },
    });

    const geofenceLayer = createGeofenceLayer();
    const notamLayer = createNotamLayer();

    const map = new OlMap({
      target: containerRef.current,
      layers: [baseLayer, sensorLayer, adsbLayer, droneLayer, geofenceLayer, notamLayer],
      view: sharedView,
    });

    mapRef.current = map;
    sensorLayerRef.current = sensorLayer;
    adsbLayerRef.current = adsbLayer;
    droneLayerRef.current = droneLayer;
    geofenceLayerRef.current = geofenceLayer;
    notamLayerRef.current = notamLayer;

    // Synchronize initial visibility
    adsbLayer.setVisible(true);
    sensorLayer.setVisible(true);
    droneLayer.setVisible(true);
    geofenceLayer.setVisible(true);
    notamLayer.setVisible(true);

    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const entityKind = feature.get("entityKind") as EntityRef["kind"] | undefined;
        let id = String(feature.getId() ?? "");
        if (id.endsWith("-coverage")) id = id.replace("-coverage", "");

        if (entityKind && id) {
          onSelectEntityRef.current({ kind: entityKind, id });
          return true;
        }
        return false;
      });
    });

    return () => {
      map.setTarget(undefined);
      sensorLayerRef.current = null;
      adsbLayerRef.current = null;
      droneLayerRef.current = null;
      geofenceLayerRef.current = null;
      notamLayerRef.current = null;
      mapRef.current = null;
    };
  }, [baseLayer]);

  const handleHomeClick = () => {
    const map = mapRef.current;
    if (!map) return;
    map.getView().animate({
      center: to3857(ESTONIA_CENTER),
      zoom: ESTONIA_ZOOM,
      duration: 1000,
    });
  };

  // Subscribe to mapApi events
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSetGeofences = (geofences: any[]) => {
      const source = geofenceLayerRef.current?.getSource();
      if (!source) return;

      source.clear();
      geofences.forEach((g) => {
        const poly = geofenceStore.asPolygon(g);
        const ring = poly.coordinates[0].map((pt: [number, number]) => to3857(pt));
        const center3857 = g.geometry.kind === "circle" ? to3857([g.geometry.center.lon, g.geometry.center.lat]) : null;

        const feature = new Feature({
          geometry: new Polygon([ring]),
          name: g.name,
          center: center3857,
          entityKind: "geofence",
        });
        feature.setId(g.id);
        source.addFeature(feature);
      });
    };

    const handleSetNotams = (notams: NormalizedNotam[]) => {
      const source = notamLayerRef.current?.getSource();
      if (!source) return;

      source.clear();
      notams.forEach((notam) => {
        const geom = notamGeometryToOl(notam.geometry);
        if (!geom) return;

        const feature = new Feature({
          geometry: geom,
          notamId: notam.id,
          entityKind: "notam",
        });
        feature.setId(notam.id);
        source.addFeature(feature);
      });
    };

    const handleSetLayerVisibility = ({ id, visible }: { id: string; visible: boolean }) => {
      const layer =
        id === "sensors" || id === "sensor"
          ? sensorLayerRef.current
          : id === "adsb" || id === "flight"
            ? adsbLayerRef.current
            : id === "drones" || id === "drone"
              ? droneLayerRef.current
              : id === "geofences" || id === "geofence"
                ? geofenceLayerRef.current
                : id === "notams" || id === "notam"
                  ? notamLayerRef.current
                  : null;

      if (layer) {
        layer.setVisible(visible);
      }
    };

    const handleCenterOnEntity = ({ kind, id }: { kind: EntityRef["kind"]; id: string }) => {
      const point = window.__debugMap?.getFeaturePosition(kind, id);
      if (point) {
        const view = mapRef.current?.getView();
        if (view) {
          view.animate({
            center: to3857(point),
            duration: 500,
            zoom: Math.max(view.getZoom() ?? 0, 14),
          });
        }
      }
    };

    const handleSetFocus = ({ kind, id }: { kind: EntityRef["kind"]; id: string | null }) => {
      if (!id) {
        setFocusedEntity(null);
      } else {
        setFocusedEntity({ kind, id });
      }
    };

    const handleSetTrackVisibility = ({ id, visible }: { id: string; visible: boolean }) => {
      setVisibleTracks((prev) => {
        const next = new Set(prev);
        if (visible) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    };

    mapApi.on("set-geofences", handleSetGeofences);
    mapApi.on("set-notams", handleSetNotams);
    mapApi.on("set-layer-visibility", handleSetLayerVisibility);
    mapApi.on("center-on-entity", handleCenterOnEntity);
    mapApi.on("set-focus", handleSetFocus);
    mapApi.on("set-track-visibility", handleSetTrackVisibility);

    // Initial load
    handleSetGeofences(geofenceStore.getAll());

    return () => {
      mapApi.off("set-geofences", handleSetGeofences);
      mapApi.off("set-notams", handleSetNotams);
      mapApi.off("set-layer-visibility", handleSetLayerVisibility);
      mapApi.off("center-on-entity", handleCenterOnEntity);
      mapApi.off("set-focus", handleSetFocus);
      mapApi.off("set-track-visibility", handleSetTrackVisibility);
    };
  }, []);


  useEffect(() => {
    window.__debugMap = {
      getFeaturePosition: (kind: EntityRef["kind"], id: string) => {
        const layer =
          kind === "drone"
            ? droneLayerRef.current
            : kind === "sensor"
              ? sensorLayerRef.current
              : kind === "aircraft" || kind === "flight"
                ? adsbLayerRef.current
                : null;

        const lookupId = (kind === "aircraft" || kind === "flight") ? `flight:${id}` : id;
        const feature = layer?.getSource()?.getFeatureById(lookupId);
        const geometry = feature?.getGeometry();

        if (!(geometry instanceof Point)) {
          return null;
        }

        return to4326(geometry.getCoordinates() as [number, number]);
      },
    };

    return () => {
      delete window.__debugMap;
    };
  }, []);

  useEffect(() => {
    const layer = sensorLayerRef.current;
    const source = layer?.getSource();
    if (!source) return;

    source.clear();

    (sensors ?? []).forEach((sensor) => {
      const center = to3857([sensor.position.lon, sensor.position.lat]);

      // Coverage circle
      const radius = sensor.coverage?.radiusMeters ?? 3000;
      const coverageCircle = new CircleGeom(center, radius);
      const coverageFeature = new Feature({
        geometry: fromCircle(coverageCircle, 64),
        sensorId: sensor.id,
        entityKind: "sensor",
        isCoverage: true,
      });
      coverageFeature.setId(`${sensor.id}-coverage`);
      source.addFeature(coverageFeature);

      // Sensor point
      const feature = new Feature({
        geometry: new Point(center),
        sensorId: sensor.id,
        entityKind: "sensor",
      });
      feature.setId(sensor.id);
      source.addFeature(feature);
    });
    layer?.changed();
  }, [sensors]);

  useEffect(() => {
    const layer = adsbLayerRef.current;
    const source = layer?.getSource();
    if (!source) return;

    const seen = new Set<string>();

    if (adsbTracks) {
      adsbTracks.forEach((points, id) => {
        if (points.length < 2) return;
        const featureId = `flightTrack:${id}`;

        // Only render if visibleTracks has it
        if (!visibleTracks.has(id)) {
          const feature = source.getFeatureById(featureId);
          if (feature) source.removeFeature(feature);
          return;
        }

        const coords = points.map((pt: any) => to3857([pt.position.lon, pt.position.lat]));
        const line = new LineString(coords);
        const existing = source.getFeatureById(featureId) as Feature<LineString> | null;
        const feature =
          existing ??
          new Feature({
            entityKind: "flight",
            flightId: id,
          });

        feature.setId(featureId);
        feature.set("flightId", id);
        feature.setGeometry(line);
        if (!existing) {
          source.addFeature(feature);
        }
        seen.add(featureId);
      });
    }

    (aircraft ?? []).forEach((item) => {
      const featureId = `flight:${item.id}`;
      const point = to3857([item.position.lon, item.position.lat]);
      const existing = source.getFeatureById(featureId) as Feature<Point> | null;
      const geometry = existing?.getGeometry() as Point | null;
      const pointGeometry = geometry ?? new Point(point);

      if (!geometry) {
        pointGeometry.setCoordinates(point);
      } else {
        geometry.setCoordinates(point);
      }

      const feature =
        existing ??
        new Feature({
          entityKind: "flight",
          flightId: item.id,
        });

      feature.setId(featureId);
      feature.set("flightId", item.id);
      feature.set("trackDeg", item.trackDeg ?? 0);
      feature.setGeometry(pointGeometry);

      if (!existing) {
        source.addFeature(feature);
      }

      seen.add(featureId);
    });

    source.getFeatures().forEach((feature) => {
      const id = feature.getId();
      if (typeof id !== "string") return;
      if ((id.startsWith("flight:") || id.startsWith("flightTrack:")) && !seen.has(id)) {
        source.removeFeature(feature);
      }
    });

    layer?.changed();
  }, [aircraft, adsbTracks, visibleTracks]);

  // Placeholder for Drone Tracks
  const droneTracks = useMemo(() => {
    // This is a placeholder since drone tracks aren't fully implemented in the service layer yet.
    // For now, we'll just mock it if visibleTracks has the drone ID.
    const tracks = new Map<string, Array<{ position: { lon: number; lat: number } }>>();
    (drones ?? []).forEach((drone) => {
      if (visibleTracks.has(drone.id)) {
        // Just show a tiny segment back from current position as a placeholder
        tracks.set(drone.id, [
          { position: { lon: drone.position.lon - 0.001, lat: drone.position.lat - 0.001 } },
          { position: { lon: drone.position.lon, lat: drone.position.lat } },
        ]);
      }
    });
    return tracks;
  }, [drones, visibleTracks]);

  useEffect(() => {
    const layer = droneLayerRef.current;
    const source = layer?.getSource();
    if (!source) return;

    // Clear old tracks (features starting with 'droneTrack:')
    source.getFeatures().forEach((f: any) => {
      const id = String(f.getId() ?? "");
      if (id.startsWith("droneTrack:")) {
        source.removeFeature(f);
      }
    });

    droneTracks.forEach((points: any, id: string) => {
      if (points.length < 2) return;
      const coords = points.map((pt: any) => to3857([pt.position.lon, pt.position.lat]));
      const line = new LineString(coords);
      const feature = new Feature({
        geometry: line,
        entityKind: "drone",
        droneId: id,
        isTrack: true,
      });
      feature.setId(`droneTrack:${id}`);
      source.addFeature(feature);
    });

    (drones ?? []).forEach((drone) => {
      const point = new Point(to3857([drone.position.lon, drone.position.lat]));
      const existing = source.getFeatureById(drone.id) as Feature<Point> | null;
      if (existing) {
        existing.setGeometry(point);
      } else {
        const pointFeature = new Feature({ geometry: point, entityKind: "drone" });
        pointFeature.setId(drone.id);
        source.addFeature(pointFeature);
      }
    });
    layer?.changed();
  }, [drones, droneTracks]);

  // Also style the drone track
  useEffect(() => {
    const layer = droneLayerRef.current;
    if (!layer) return;

    const originalStyle = layer.getStyle();
    layer.setStyle((feature: any) => {
      const isTrack = feature.get("isTrack") === true;
      const droneId = feature.get("droneId") as string | undefined;
      const selectedId = selectedRef.current?.kind === "drone" ? selectedRef.current.id : null;
      const selected = (droneId && droneId === selectedId) || (feature.getId() === selectedId);

      if (isTrack) {
        return new Style({
          stroke: new Stroke({
            color: selected ? "#1b5e20" : "#4caf50",
            width: selected ? 3 : 2,
            lineDash: [4, 4], // dashed for placeholder
          }),
        });
      }

      // Default style for drone points
      const droneIdPoint = String(feature.getId() ?? "");
      const selectedPoint = selectedRef.current?.kind === "drone" && selectedRef.current.id === droneIdPoint;
      return new Style({
        image: new CircleStyle({
          radius: selectedPoint ? 9 : 7,
          fill: new Fill({ color: selectedPoint ? "#2e7d32" : "#4caf50" }),
          stroke: new Stroke({ color: "#1b5e20", width: selectedPoint ? 3 : 2 }),
        }),
      });
    });
  }, [selectedEntity]);

  // Auto-focus move logic
  useEffect(() => {
    if (!focusedEntity) return;

    const point = window.__debugMap?.getFeaturePosition(focusedEntity.kind, focusedEntity.id);
    if (point) {
      const view = mapRef.current?.getView();
      if (view) {
        view.animate({
          center: to3857(point),
          duration: 300,
        });
      }
    }
  }, [aircraft, drones, focusedEntity]);

  // Mouse hover coordinates overlay
  const [hoverCoords, setHoverCoords] = React.useState<[number, number] | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handlePointerMove = (evt: any) => {
      if (evt.coordinate) {
        const coords = to4326(evt.coordinate as [number, number]);
        setHoverCoords(coords);
      }
    };

    map.on("pointermove", handlePointerMove);
    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [baseLayer]); // baseLayer is stable enough, but ensures it runs after map init

  // Center map on selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEntity) return;

    const layers = [
      sensorLayerRef.current,
      adsbLayerRef.current,
      droneLayerRef.current,
      geofenceLayerRef.current,
      notamLayerRef.current,
    ];

    let foundGeom: any = null;
    const lookupId = selectedEntity.kind === "flight" ? `flight:${selectedEntity.id}` : selectedEntity.id;

    for (const layer of layers) {
      if (!layer) continue;
      const feature = layer.getSource()?.getFeatureById(lookupId);
      if (feature) {
        foundGeom = feature.getGeometry();
        break;
      }
    }

    if (foundGeom) {
      const view = map.getView();
      const currentZoom = view.getZoom() ?? 0;

      if (foundGeom instanceof Point) {
        // Keep current zoom, but ensure it's at least a reasonable level (e.g., 14) if zooming in is needed
        // The user says "would not zoom out but keep the latest state"
        view.animate({
          center: foundGeom.getCoordinates(),
          duration: 500,
          zoom: Math.max(currentZoom, 14),
        });
      } else {
        // For extents (geofences), fit them but strictly avoid zooming out
        const currentRes = view.getResolution();
        view.fit(foundGeom.getExtent(), {
          padding: [50, 50, 50, 50],
          duration: 500,
          minResolution: currentRes, // This prevents zooming out
          maxZoom: 16, // But allow zooming in up to 16
        });
      }
    }
  }, [selectedEntity]);

  // Force redraw on selection change
  useEffect(() => {
    sensorLayerRef.current?.changed();
    adsbLayerRef.current?.changed();
    droneLayerRef.current?.changed();
    geofenceLayerRef.current?.changed();
  }, [selectedEntity]);

  // Sync layer visibility with tool
  useEffect(() => {
    if (tool === "airplanes") {
      adsbLayerRef.current?.setVisible(true);
    }
    // You could add logic here to hide/show other layers if desired,
    // but for now we just ensure ADS-B is ON when in Air tool.
  }, [tool]);

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />

      {/* Map Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 48, // Next to zoom +/-
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <IconButton
          size="small"
          onClick={handleHomeClick}
          title="Center on Estonia"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "2px solid rgba(0,0,0,0.2)",
            borderRadius: "4px",
            width: "32px",
            height: "32px",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 1 }}>🏠</Typography>
        </IconButton>
      </Box>

      {hoverCoords && (
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
            backgroundColor: "transparent",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <Typography variant="body2" sx={{ color: "black", fontWeight: 600, fontFamily: "monospace" }}>
            {hoverCoords[1].toFixed(6)}°N, {hoverCoords[0].toFixed(6)}°E
          </Typography>
        </Box>
      )}
    </Box>
  );
}
