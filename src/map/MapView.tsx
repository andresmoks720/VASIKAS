import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";

import { createMaaAmetOrthoLayer } from "./layers/maaAmetOrthoWmts";
import { to3857 } from "./transforms";

const ESTONIA_CENTER_LON_LAT: [number, number] = [24.7536, 59.437];
const DEFAULT_ZOOM = 7;

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const wmtsLayer = createMaaAmetOrthoLayer(import.meta.env.VITE_MAP_WMTS_URL);

    const map = new Map({
      target: containerRef.current,
      layers: [wmtsLayer ?? new TileLayer({ source: new OSM() })],
      view: new View({
        projection: "EPSG:3857",
        center: to3857(ESTONIA_CENTER_LON_LAT),
        zoom: DEFAULT_ZOOM,
      }),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, []);

  return <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />;
}
