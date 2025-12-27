import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import OlMap from "ol/Map";
import View from "ol/View";

import { createNotamsLayerController } from "@/map/layers/controllers/createNotamsLayerController";
import { to3857 } from "@/map/transforms";
import { normalizeNotams } from "@/services/notam/notamNormalizer";
import edgeCaseNotams from "@/test/fixtures/notamGeometryEdgeCases.json";

const ESTONIA_CENTER_LON_LAT: [number, number] = [25.1122, 58.5648];

type ExtentSummary = { width: number; height: number } | null;

export function NotamGeometryTestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [featureCount, setFeatureCount] = useState(0);
  const [extentSummary, setExtentSummary] = useState<ExtentSummary>(null);
  const [isReady, setIsReady] = useState(false);
  const notamsController = useMemo(() => createNotamsLayerController(), []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const map = new OlMap({
      target: containerRef.current,
      layers: [notamsController.layer],
      view: new View({
        projection: "EPSG:3857",
        center: to3857(ESTONIA_CENTER_LON_LAT),
        zoom: 5,
      }),
      controls: [],
      interactions: [],
    });

    return () => {
      map.setTarget(undefined);
      notamsController.dispose();
    };
  }, [notamsController]);

  useEffect(() => {
    const normalized = normalizeNotams(edgeCaseNotams, new Date().toISOString());
    notamsController.setData(normalized);

    const source = notamsController.layer.getSource();
    const features = source?.getFeatures() ?? [];
    setFeatureCount(features.length);

    const extent = source?.getExtent();
    if (extent && extent.every((value) => Number.isFinite(value))) {
      setExtentSummary({
        width: extent[2] - extent[0],
        height: extent[3] - extent[1],
      });
    } else {
      setExtentSummary(null);
    }
    setIsReady(true);
  }, [notamsController]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">NOTAM geometry test</Typography>
        <Typography data-testid="notam-feature-count">{featureCount}</Typography>
        <Typography data-testid="notam-ready">{isReady ? "ready" : "loading"}</Typography>
        <Typography
          data-testid="notam-extent"
          data-width={extentSummary?.width ?? ""}
          data-height={extentSummary?.height ?? ""}
        >
          extent
        </Typography>
      </Box>
      <Box ref={containerRef} sx={{ flex: 1 }} data-testid="notam-map" />
    </Box>
  );
}
