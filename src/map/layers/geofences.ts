import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Text, Fill } from "ol/style";

export function createGeofenceLayer(): VectorLayer<VectorSource> {
    return new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
            const name = feature.get("name") as string | undefined;
            return new Style({
                stroke: new Stroke({
                    color: "#d32f2f", // Red-ish for geofence boundary
                    width: 2,
                    lineDash: [10, 10],
                }),
                fill: new Fill({
                    color: "rgba(211, 47, 47, 0.1)", // Very light transparent red
                }),
                text: name
                    ? new Text({
                        text: name,
                        font: "12px sans-serif",
                        overflow: true,
                        fill: new Fill({ color: "#d32f2f" }),
                        stroke: new Stroke({ color: "#fff", width: 3 }),
                        offsetY: -15,
                    })
                    : undefined,
            });
        },
        zIndex: 10, // Ensure it's above base layers
    });
}
