import { fromLonLat, toLonLat } from "ol/proj";

export type LonLat = [number, number];
export type WebMercator = [number, number];

export function to3857(lonLat: LonLat): WebMercator {
  return fromLonLat(lonLat) as WebMercator;
}

export function to4326(webMercator: WebMercator): LonLat {
  return toLonLat(webMercator) as LonLat;
}
