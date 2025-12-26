import { Router } from 'express';
import { computeDronesSnapshot } from '../sim/circleModel';

export const dronesRouter = Router();

// Clamp helper
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

dronesRouter.get('/', (req, res) => {
    const centerParam = req.query.center as string;

    if (!centerParam) {
        return res.status(400).json({ error: "Missing required query parameter: center" });
    }

    const parts = centerParam.split(',');
    if (parts.length !== 2) {
        return res.status(400).json({ error: "Invalid center format. Expected lat,lon" });
    }

    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return res.status(400).json({ error: "Invalid center coordinates", details: { lat, lon } });
    }

    // Parse other params with defaults and camping
    const radiusM = clamp(parseInt(req.query.radius_m as string || "2000", 10), 1, 20000);
    const n = clamp(parseInt(req.query.n as string || "1", 10), 1, 100);
    const periodS = clamp(parseInt(req.query.period_s as string || "60", 10), 10, 3600);

    const tSecUsed = Math.floor(Date.now() / 1000);

    const snapshot = computeDronesSnapshot({
        centerLat: lat,
        centerLon: lon,
        radiusM,
        n,
        periodS,
        tSecUsed
    });

    const response = {
        server_time_utc: new Date().toISOString(),
        t_sec_used: tSecUsed,
        center: { lat, lon },
        meta: {
            model: "circle-v1",
            poll_hint_ms: 1000,
            radius_m: radiusM,
            period_s: periodS,
            n
        },
        drones: snapshot.drones
    };

    res.json(response);
});
