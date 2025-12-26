export type DroneEnvConfig = {
    centerLat?: number;
    centerLon?: number;
    radiusM: number;
    n: number;
    periodS: number;
};

export function buildSnapshotDronesUrl(baseUrl: string, config: DroneEnvConfig): string {
    // If center is missing, we cannot build a valid snapshot URL automatically, 
    // so we return the base URL as-is (assuming user provided a full URL or is using track mode).
    if (config.centerLat === undefined || config.centerLon === undefined) {
        return baseUrl;
    }

    if (!Number.isFinite(config.centerLat) || !Number.isFinite(config.centerLon)) {
        return baseUrl;
    }

    const url = new URL(baseUrl, "http://localhost"); // Dummy base for parsing relative URLs
    const params = url.searchParams;

    // Append params only if not already present
    if (!params.has("center")) {
        params.set("center", `${config.centerLat},${config.centerLon}`);
    }
    if (!params.has("radius_m")) {
        params.set("radius_m", config.radiusM.toString());
    }
    if (!params.has("n")) {
        params.set("n", config.n.toString());
    }
    if (!params.has("period_s")) {
        params.set("period_s", config.periodS.toString());
    }

    // carefully reconstruct the URL
    // If original was relative, keep it relative.
    const isRelative = !baseUrl.match(/^https?:\/\//);
    if (isRelative) {
        return url.pathname + url.search;
    }

    return url.toString();
}
