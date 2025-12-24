import ImageTile from "ol/ImageTile";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const FALLBACK_PLACEHOLDER_TILE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAKeGdUgAAAAASUVORK5CYII=";

let cachedPlaceholderTileDataUrl: string | null = null;

function getPlaceholderTileDataUrl() {
  if (cachedPlaceholderTileDataUrl) {
    return cachedPlaceholderTileDataUrl;
  }

  if (typeof document === "undefined") {
    return FALLBACK_PLACEHOLDER_TILE_DATA_URL;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) {
    return FALLBACK_PLACEHOLDER_TILE_DATA_URL;
  }

  context.fillStyle = "#e0e0e0";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#bdbdbd";
  context.lineWidth = 2;
  context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  context.fillStyle = "#424242";
  context.font = "16px sans-serif";
  context.fillText("Offline demo tile", 40, 132);

  cachedPlaceholderTileDataUrl = canvas.toDataURL("image/png");
  return cachedPlaceholderTileDataUrl;
}

export function createOfflineXyzLayer() {
  const offlineSource = new XYZ({
    url: "/tiles/demo/{z}/{x}/{y}.png",
    minZoom: 7,
    maxZoom: 10,
    tileLoadFunction: (tile) => {
      if (tile instanceof ImageTile) {
        const image = tile.getImage() as HTMLImageElement;
        image.src = getPlaceholderTileDataUrl();
      }
    },
  });

  return new TileLayer({
    source: offlineSource,
  });
}
