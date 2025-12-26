import { describe, expect, it } from "vitest";
import ImageTile from "ol/ImageTile";
import TileState from "ol/TileState";
import { createOfflineXyzLayer } from "./offlineXyz";

describe("createOfflineXyzLayer", () => {
  it("falls back to the placeholder only after a tile load error", () => {
    const layer = createOfflineXyzLayer();
    const source = layer.getSource();
    if (!source) {
      throw new Error("Expected offline XYZ layer to have a source.");
    }

    const tileLoadFunction = source.getTileLoadFunction();
    const tile = new ImageTile([0, 0, 0], TileState.IDLE, "about:blank", null, () => {});
    const image = tile.getImage() as HTMLImageElement;

    tileLoadFunction(tile, "https://example.com/tiles/0/0/0.png");

    expect(image.src).toContain("/tiles/0/0/0.png");

    image.onerror?.(new Event("error"));

    expect(image.src).toMatch(/^data:image\/png;base64,/);
  });
});
