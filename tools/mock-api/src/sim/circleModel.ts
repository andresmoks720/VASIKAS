export type DroneSnapshot = {
    tSecUsed: number;
    drones: Array<{
        id: string;
        label: string;
        position: { lon: number; lat: number };
        headingDeg: number;
        speedMps: number;
        altitude: { meters: number; ref: "AGL"; source: "mock"; comment: string };
        eventTimeUtc: string;
    }>;
};

export function computeDronesSnapshot(params: {
    centerLat: number;
    centerLon: number;
    radiusM: number;
    n: number;
    periodS: number;
    tSecUsed: number;
}): DroneSnapshot {
    const { centerLat, centerLon, radiusM, n, periodS, tSecUsed } = params;
    const drones = [];

    const centerLatRad = (centerLat * Math.PI) / 180;
    const metersPerDegLat = 111320;
    const metersPerDegLon = 111320 * Math.cos(centerLatRad);
    const speedMps = (2 * Math.PI * radiusM) / periodS;

    // Altitude constants
    const altBase = 120;
    const altAmp = 20;
    const altPeriodS = 30;

    for (let i = 0; i < n; i++) {
        const phase_i = i * ((2 * Math.PI) / n);
        const theta = (2 * Math.PI * (tSecUsed / periodS)) + phase_i;

        const x = radiusM * Math.cos(theta); // East
        const y = radiusM * Math.sin(theta); // North

        const lat = centerLat + y / metersPerDegLat;
        const lon = centerLon + x / metersPerDegLon;

        // Heading tangent: (deg(theta) + 90) % 360
        // theta is in radians.
        // At theta=0 (East), heading should be North (0 deg? No: standard nav: 0 is North, 90 East).
        // Math angle 0 is East. We want heading.
        // If moving counter-clockwise:
        // Pos: (cos t, sin t). Velocity: (-sin t, cos t).
        // At t=0, vel is (0, 1) -> North. Heading 0.
        // At t=90deg (North), vel is (-1, 0) -> West. Heading 270.
        // Standard math angle conversion to bearing: Bearing = 90 - MathAngle.
        // Let's use the requested formula: "headingDeg = (deg(theta) + 90) % 360"
        // Wait, let's check the user requirement carefully: "Heading tangent (“always ahead”): headingDeg = (deg(theta) + 90) % 360"
        // Let's implement exactly as requested.
        let thetaDeg = (theta * 180) / Math.PI;
        let headingDeg = (thetaDeg + 90) % 360;
        if (headingDeg < 0) headingDeg += 360; // Normalize just in case

        // Altitude
        // altMeters = altBase + altAmp * sin(2π * tSecUsed / altPeriodS + altPhase_i)
        // altPhase_i = phase_i
        const altMeters = altBase + altAmp * Math.sin((2 * Math.PI * tSecUsed / altPeriodS) + phase_i);

        const eventTimeUtc = new Date(tSecUsed * 1000).toISOString();

        drones.push({
            id: `drone-${i}`,
            label: `Drone ${i}`,
            position: { lon, lat },
            headingDeg,
            speedMps,
            altitude: {
                meters: altMeters,
                ref: "AGL" as const,
                source: "mock" as const,
                comment: "Circle Pattern"
            },
            eventTimeUtc
        });
    }

    return {
        tSecUsed,
        drones
    };
}
