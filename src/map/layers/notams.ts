import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Text, Fill } from "ol/style";

/**
 * Creates a vector layer for rendering NOTAM geometry overlays.
 * Styled with orange outline and labels showing NOTAM id.
 */
export function createNotamLayer(): VectorLayer<VectorSource> {
    return new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
            const notamId = feature.get("notamId") as string | undefined;
            return new Style({
                stroke: new Stroke({
                    color: "#ff6f00", // Orange for NOTAM areas
                    width: 2,
                    lineDash: [5, 5],
                }),
                fill: new Fill({
                    color: "rgba(255, 111, 0, 0.1)", // Very light transparent orange
                }),
                text: notamId
                    ? new Text({
                        text: notamId,
                        font: "bold 11px sans-serif",
                        overflow: true,
                        fill: new Fill({ color: "#e65100" }),
                        stroke: new Stroke({ color: "#fff", width: 3 }),
                        offsetY: -12,
                        backgroundFill: new Fill({ color: "rgba(255, 255, 255, 0.8)" }),
                        padding: [2, 4, 2, 4],
                    })
                    : undefined,
            });
        },
        zIndex: 15, // Above geofences, below point markers
    });
}
