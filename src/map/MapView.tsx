import React, { useEffect, useMemo, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import type { Geometry } from "ol/geom";
import OlMap from "ol/Map";
import type BaseEvent from "ol/events/Event";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { Fill, RegularShape, Stroke, Style } from "ol/style";

import { createMaaAmetOrthoLayer } from "./layers/maaAmetOrthoWmts";
import { to3857, to4326 } from "./transforms";
import { EntityRef, Tool } from "@/layout/MapShell/urlState";
import { ENV } from "@/shared/env";
import { useSharedAdsbStream, useSharedDronesStream, useSharedSensorsStream } from "@/services/streams/StreamsProvider";
import { mapApi } from "./mapApi";
import { Geofence, geofenceStore } from "@/services/geofences/geofenceStore";
import { createDronesLayerController } from "@/map/layers/controllers/createDronesLayerController";
import { createGeofencesLayerController } from "@/map/layers/controllers/createGeofencesLayerController";
import { createNotamsLayerController } from "@/map/layers/controllers/createNotamsLayerController";
import { createSensorsLayerController } from "@/map/layers/controllers/createSensorsLayerController";
import { NormalizedNotam } from "@/services/notam/notamTypes";
import { TrackPoint } from "@/services/adsb/trackStore";

const ESTONIA_CENTER_LON_LAT: [number, number] = [25.1122, 58.5648]; // Match new ADS-B default center
const DEFAULT_ZOOM = 7.5;

// Shared view singleton to maintain state across remounts/tool switches
const sharedView = new View({
  projection: "EPSG:3857",
  center: to3857(ESTONIA_CENTER_LON_LAT),
  zoom: DEFAULT_ZOOM,
});

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
  const adsbLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const sensorsController = useMemo(() => createSensorsLayerController(), []);
  const dronesController = useMemo(() => createDronesLayerController(), []);
  const geofencesController = useMemo(() => createGeofencesLayerController(), []);
  const notamsController = useMemo(() => createNotamsLayerController(), []);

  const { data: sensors } = useSharedSensorsStream();
  const { data: aircraft, tracks: adsbTracks } = useSharedAdsbStream();
  const { data: drones } = useSharedDronesStream();

  const selectedRef = useRef<EntityRef | null>(selectedEntity);
  selectedRef.current = selectedEntity;

  const onSelectEntityRef = useRef(onSelectEntity);
  onSelectEntityRef.current = onSelectEntity;

  const [focusedEntity, setFocusedEntity] = React.useState<{ kind: EntityRef["kind"]; id: string } | null>(null);
  const [visibleTracks, setVisibleTracks] = React.useState<Set<string>>(new Set());

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

    const adsbSource = new VectorSource();
    const adsbLayer = new VectorLayer({
      source: adsbSource,
      style: (feature) => {
        const isTrack = feature.getGeometry() instanceof LineString;
        const flightId = feature.get("flightId") as string | undefined;
        const selected =
          flightId && selectedRef.current?.kind === "flight" && selectedRef.current?.id === flightId;

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

    const map = new OlMap({
      target: containerRef.current,
      layers: [
        baseLayer,
        sensorsController.layer,
        adsbLayer,
        dronesController.layer,
        geofencesController.layer,
        notamsController.layer,
      ],
      view: sharedView,
    });

    mapRef.current = map;
    adsbLayerRef.current = adsbLayer;

    adsbLayer.setVisible(true);
    sensorsController.layer.setVisible(true);
    dronesController.layer.setVisible(true);
    geofencesController.layer.setVisible(true);
    notamsController.layer.setVisible(true);

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
      adsbLayerRef.current = null;
      mapRef.current = null;
      sensorsController.dispose();
      dronesController.dispose();
      geofencesController.dispose();
      notamsController.dispose();
    };
  }, [
    baseLayer,
    sensorsController,
    dronesController,
    geofencesController,
    notamsController,
  ]);

  const handleHomeClick = () => {
    const map = mapRef.current;
    if (!map) return;
    map.getView().animate({
      center: to3857(ESTONIA_CENTER),
      zoom: ESTONIA_ZOOM,
      duration: 1000,
    });
  };

  useEffect(() => {
    sensorsController.setSelection?.(selectedEntity);
    dronesController.setSelection?.(selectedEntity);
  }, [selectedEntity, sensorsController, dronesController]);

  // Subscribe to mapApi events
  useEffect(() => {
    const handleSetGeofences = (geofences: Geofence[]) => {
      geofencesController.setData(geofences);
    };

    const handleSetNotams = (notams: NormalizedNotam[]) => {
      notamsController.setData(notams);
    };

    const handleSetLayerVisibility = ({ id, visible }: { id: string; visible: boolean }) => {
      const layer =
        id === "sensors" || id === "sensor"
          ? sensorsController.layer
          : id === "adsb" || id === "flight"
            ? adsbLayerRef.current
            : id === "drones" || id === "drone"
              ? dronesController.layer
              : id === "geofences" || id === "geofence"
                ? geofencesController.layer
                : id === "notams" || id === "notam"
                  ? notamsController.layer
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
  }, [geofencesController, notamsController, sensorsController.layer, dronesController.layer]);

  useEffect(() => {
    window.__debugMap = {
      getFeaturePosition: (kind: EntityRef["kind"], id: string) => {
        const layer =
          kind === "drone"
            ? dronesController.layer
            : kind === "sensor"
              ? sensorsController.layer
              : kind === "aircraft" || kind === "flight"
                ? adsbLayerRef.current
                : null;

        const lookupId = kind === "aircraft" || kind === "flight" ? `flight:${id}` : id;
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
  }, [sensorsController.layer, dronesController.layer]);

  useEffect(() => {
    sensorsController.setData(sensors ?? []);
  }, [sensors, sensorsController]);

  useEffect(() => {
    const layer = adsbLayerRef.current;
    const source = layer?.getSource();
    if (!source) return;

    const seen = new Set<string>();

    if (adsbTracks) {
      adsbTracks.forEach((points, id) => {
        if (points.length < 2) return;
        const featureId = `flightTrack:${id}`;

        if (!visibleTracks.has(id)) {
          const feature = source.getFeatureById(featureId);
          if (feature) source.removeFeature(feature);
          return;
        }

        const coords = points.map((pt: TrackPoint) => to3857([pt.position.lon, pt.position.lat]));
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

  useEffect(() => {
    dronesController.setData({
      drones: drones ?? [],
      visibleTrackIds: visibleTracks,
    });
  }, [drones, visibleTracks, dronesController]);

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

    const handlePointerMove = (evt: MapBrowserEvent<PointerEvent>) => {
      if (evt.coordinate) {
        const coords = to4326(evt.coordinate as [number, number]);
        setHoverCoords(coords);
      }
    };

    map.on("pointermove", handlePointerMove as (event: Event | BaseEvent) => void);
    return () => {
      map.un("pointermove", handlePointerMove as (event: Event | BaseEvent) => void);
    };
  }, [baseLayer]);

  // Center map on selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedEntity) return;

    const layers = [
      sensorsController.layer,
      adsbLayerRef.current,
      dronesController.layer,
      geofencesController.layer,
      notamsController.layer,
    ];

    let foundGeom: Geometry | null = null;
    const lookupId = selectedEntity.kind === "flight" ? `flight:${selectedEntity.id}` : selectedEntity.id;

    for (const layer of layers) {
      if (!layer) continue;
      const feature = layer.getSource()?.getFeatureById(lookupId);
      if (feature) {
        foundGeom = feature.getGeometry() ?? null;
        break;
      }
    }

    if (foundGeom) {
      const view = map.getView();
      const currentZoom = view.getZoom() ?? 0;

      if (foundGeom instanceof Point) {
        view.animate({
          center: foundGeom.getCoordinates(),
          duration: 500,
          zoom: Math.max(currentZoom, 14),
        });
      } else {
        const currentRes = view.getResolution();
        view.fit(foundGeom.getExtent(), {
          padding: [50, 50, 50, 50],
          duration: 500,
          minResolution: currentRes,
          maxZoom: 16,
        });
      }
    }
  }, [selectedEntity, sensorsController, dronesController, geofencesController, notamsController]);

  // Force redraw on selection change
  useEffect(() => {
    sensorsController.layer.changed();
    adsbLayerRef.current?.changed();
    dronesController.layer.changed();
    geofencesController.layer.changed();
  }, [selectedEntity, sensorsController, dronesController, geofencesController]);

  // Sync layer visibility with tool
  useEffect(() => {
    if (tool === "airplanes") {
      adsbLayerRef.current?.setVisible(true);
    }
  }, [tool]);

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />

      {/* Map Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 48,
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
