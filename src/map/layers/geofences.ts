import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke, Text, Fill, Circle as CircleStyle } from "ol/style";
import Point from "ol/geom/Point";

export function createGeofenceLayer(): VectorLayer<VectorSource> {
    return new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
            const name = feature.get("name") as string | undefined;
            const center = feature.get("center") as [number, number] | undefined;

            const areaStyle = new Style({
                stroke: new Stroke({
                    color: "#C71585", // MediumVioletRed
                    width: 2,
                    lineDash: [6, 6],
                }),
                fill: new Fill({
                    color: "rgba(255, 20, 147, 0.15)", // Pinkish transparent
                }),
                text: name
                    ? new Text({
                        text: name,
                        font: "bold 13px sans-serif",
                        overflow: true,
                        fill: new Fill({ color: "#C71585" }),
                        stroke: new Stroke({ color: "#fff", width: 3 }),
                        offsetY: -15,
                    })
                    : undefined,
            });

            const centerStyle = center ? new Style({
                geometry: new Point(center),
                image: new CircleStyle({
                    radius: 4,
                    fill: new Fill({ color: "#C71585" }),
                    stroke: new Stroke({ color: "#fff", width: 2 }),
                }),
            }) : null;

            return centerStyle ? [areaStyle, centerStyle] : [areaStyle];
        },
        zIndex: 10,
    });
}
