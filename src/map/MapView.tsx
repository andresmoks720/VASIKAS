import React, { useEffect, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import Feature from "ol/Feature";
import Map from "ol/Map";
import Point from "ol/geom/Point";
import LineString from "ol/geom/LineString";
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { createOfflineXyzLayer } from "./layers/offlineXyz";
import { createMaaAmetOrthoLayer } from "./layers/maaAmetOrthoWmts";
import { to3857, to4326 } from "./transforms";
import { EntityRef } from "@/layout/MapShell/urlState";
import { shouldUseMocks } from "@/shared/env";
import { useSharedAdsbStream, useSharedDronesStream, useSharedSensorsStream } from "@/services/streams/StreamsProvider";

const ESTONIA_CENTER_LON_LAT: [number, number] = [24.7536, 59.437];
const DEFAULT_ZOOM = 7;

type MapViewProps = {
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

export function MapView({ selectedEntity, onSelectEntity }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const sensorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const adsbLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const droneLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { data: sensors } = useSharedSensorsStream();
  const { data: aircraft } = useSharedAdsbStream();
  const { data: drones } = useSharedDronesStream();

  const selectedRef = useRef<EntityRef | null>(selectedEntity);
  selectedRef.current = selectedEntity;

  const isSelected = useMemo(
    () => (kind: EntityRef["kind"], id: string) =>
      selectedRef.current?.kind === kind && selectedRef.current?.id === id,
    [],
  );

  const useMocks = shouldUseMocks();

  const baseLayer = useMemo(() => {
    if (useMocks) {
      return createOfflineXyzLayer();
    }

    const wmtsLayer = createMaaAmetOrthoLayer(import.meta.env.VITE_MAP_WMTS_URL);
    if (wmtsLayer) {
      return wmtsLayer;
    }

    return new TileLayer({ source: new OSM() });
  }, [useMocks]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const sensorSource = new VectorSource();
    const sensorLayer = new VectorLayer({
      source: sensorSource,
      style: (feature) => {
        const selected = isSelected("sensor", String(feature.getId() ?? ""));
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
        if (isTrack) {
          return new Style({
            stroke: new Stroke({ color: "#ff9800", width: 2 }),
          });
        }
        const selected = isSelected("aircraft", String(feature.getId() ?? ""));
        return new Style({
          image: new CircleStyle({
            radius: selected ? 8 : 6,
            fill: new Fill({ color: selected ? "#ef6c00" : "#ff9800" }),
            stroke: new Stroke({ color: "#e65100", width: selected ? 3 : 2 }),
          }),
        });
      },
    });

    const droneSource = new VectorSource();
    const droneLayer = new VectorLayer({
      source: droneSource,
      style: (feature) => {
        const selected = isSelected("drone", String(feature.getId() ?? ""));
        return new Style({
          image: new CircleStyle({
            radius: selected ? 9 : 7,
            fill: new Fill({ color: selected ? "#2e7d32" : "#4caf50" }),
            stroke: new Stroke({ color: "#1b5e20", width: selected ? 3 : 2 }),
          }),
        });
      },
    });

    const map = new Map({
      target: containerRef.current,
      layers: [baseLayer, sensorLayer, adsbLayer, droneLayer],
      view: new View({
        projection: "EPSG:3857",
        center: to3857(ESTONIA_CENTER_LON_LAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    mapRef.current = map;
    sensorLayerRef.current = sensorLayer;
    adsbLayerRef.current = adsbLayer;
    droneLayerRef.current = droneLayer;

    map.on("singleclick", (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const entityKind = feature.get("entityKind") as EntityRef["kind"] | undefined;
        const id = String(feature.getId() ?? "");
        if (entityKind && id) {
          onSelectEntity({ kind: entityKind, id });
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
      mapRef.current = null;
    };
  }, [baseLayer, isSelected, onSelectEntity]);

  useEffect(() => {
    window.__debugMap = {
      getFeaturePosition: (kind: EntityRef["kind"], id: string) => {
        const layer =
          kind === "drone"
            ? droneLayerRef.current
            : kind === "sensor"
              ? sensorLayerRef.current
              : kind === "aircraft"
                ? adsbLayerRef.current
                : null;

        const feature = layer?.getSource()?.getFeatureById(id);
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
      const feature = new Feature({
        geometry: new Point(to3857([sensor.position.lon, sensor.position.lat])),
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

    source.clear();

    (aircraft ?? []).forEach((item) => {
      const point = new Point(to3857([item.position.lon, item.position.lat]));
      const pointFeature = new Feature({
        geometry: point,
        callsign: item.callsign,
        entityKind: "aircraft",
      });
      pointFeature.setId(item.id);
      source.addFeature(pointFeature);
    });
    layer?.changed();
  }, [aircraft]);

  useEffect(() => {
    const layer = droneLayerRef.current;
    const source = layer?.getSource();
    if (!source) return;

    source.clear();
    (drones ?? []).forEach((drone) => {
      const point = new Point(to3857([drone.position.lon, drone.position.lat]));
      const pointFeature = new Feature({ geometry: point, entityKind: "drone" });
      pointFeature.setId(drone.id);
      source.addFeature(pointFeature);
    });
    layer?.changed();
  }, [drones]);

  useEffect(() => {
    sensorLayerRef.current?.changed();
    adsbLayerRef.current?.changed();
    droneLayerRef.current?.changed();
  }, [selectedEntity]);

  return <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />;
}
