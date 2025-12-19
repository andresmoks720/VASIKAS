import TileLayer from "ol/layer/Tile";
import type TileSource from "ol/source/Tile";

export function createMaaAmetOrthoLayer(envUrl?: string): TileLayer<TileSource> | null {
  // TODO: Configure Maa-amet WMTS source once layer name, matrixSet, attribution, and tileGrid are confirmed.
  // envUrl is expected to be VITE_MAP_WMTS_URL when available.
  if (!envUrl) {
    return null;
  }

  // Placeholder until WMTS details are known.
  return null;
}
