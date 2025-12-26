import { describe, it, expect } from 'vitest';
import { computeDronesSnapshot } from './circleModel';

describe('computeDronesSnapshot', () => {
    const baseParams = {
        centerLat: 58.0,
        centerLon: 25.0,
        radiusM: 1000,
        n: 3,
        periodS: 60,
        tSecUsed: 0
    };

    it('returns exactly n drones', () => {
        const snapshot = computeDronesSnapshot({ ...baseParams, n: 5 });
        expect(snapshot.drones).toHaveLength(5);
        expect(snapshot.tSecUsed).toBe(0);
    });

    it('is deterministic', () => {
        const s1 = computeDronesSnapshot({ ...baseParams, tSecUsed: 100 });
        const s2 = computeDronesSnapshot({ ...baseParams, tSecUsed: 100 });
        expect(s1).toStrictEqual(s2);
    });

    it('is periodic in position', () => {
        const t = 123.45;
        const period = 60;
        const s1 = computeDronesSnapshot({ ...baseParams, tSecUsed: t, periodS: period });
        const s2 = computeDronesSnapshot({ ...baseParams, tSecUsed: t + period, periodS: period });

        const epsilon = 1e-6;
        for (let i = 0; i < s1.drones.length; i++) {
            const d1 = s1.drones[i];
            const d2 = s2.drones[i];

            // Positions should be nearly identical
            expect(Math.abs(d1.position.lat - d2.position.lat)).toBeLessThan(epsilon);
            expect(Math.abs(d1.position.lon - d2.position.lon)).toBeLessThan(epsilon);

            // Headings should be identical (mod 360)
            const hDiff = Math.abs(d1.headingDeg - d2.headingDeg);
            expect(hDiff < epsilon || Math.abs(hDiff - 360) < epsilon).toBe(true);
        }
    });

    it('calculates expected speed', () => {
        const radius = 1000;
        const period = 60;
        const expectedSpeed = (2 * Math.PI * radius) / period;

        const s = computeDronesSnapshot({ ...baseParams, radiusM: radius, periodS: period });
        s.drones.forEach(d => {
            expect(Math.abs(d.speedMps - expectedSpeed)).toBeLessThan(1e-9);
        });
    });

    it('headings are normalized [0, 360)', () => {
        // Check various times
        [0, 15, 30, 45, 100, -10].forEach(t => {
            const s = computeDronesSnapshot({ ...baseParams, tSecUsed: t });
            s.drones.forEach(d => {
                expect(d.headingDeg).toBeGreaterThanOrEqual(0);
                expect(d.headingDeg).toBeLessThan(360);
            });
        });
    });

    it('generates valid ISO dates', () => {
        const t = 1700000000;
        const s = computeDronesSnapshot({ ...baseParams, tSecUsed: t });
        const expected = new Date(t * 1000).toISOString();
        expect(s.drones[0].eventTimeUtc).toBe(expected);
    });
});
