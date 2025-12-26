import { describe, it, expect } from 'vitest';
import { buildSnapshotDronesUrl } from './droneUrlHelper';

describe('buildSnapshotDronesUrl', () => {
    const defaults = {
        radiusM: 2000,
        n: 1,
        periodS: 60
    };

    it('returns baseUrl unchanged if center is missing', () => {
        const config = { ...defaults };
        expect(buildSnapshotDronesUrl('/api/drones', config)).toBe('/api/drones');
    });

    it('appends params when baseUrl has no query', () => {
        const config = { ...defaults, centerLat: 58.0, centerLon: 25.0 };
        const url = buildSnapshotDronesUrl('http://localhost:8787/v1/drones', config);

        expect(url).toContain('center=58%2C25');
        expect(url).toContain('radius_m=2000');
        expect(url).toContain('n=1');
        expect(url).toContain('period_s=60');
    });

    it('preserves existing query params', () => {
        const config = { ...defaults, centerLat: 58.0, centerLon: 25.0 };
        const url = buildSnapshotDronesUrl('/drones?foo=bar', config);

        expect(url).toContain('foo=bar');
        expect(url).toContain('center=58%2C25');
    });

    it('does not overwrite existing params', () => {
        const config = { ...defaults, centerLat: 58.0, centerLon: 25.0, n: 5 };
        // URL already has n=10
        const url = buildSnapshotDronesUrl('/drones?n=10', config);

        expect(url).toContain('n=10');
        expect(url).not.toContain('n=5');
        expect(url).toContain('center=58%2C25'); // Still adds missing center
    });

    it('handles relative URLs correctly', () => {
        const config = { ...defaults, centerLat: 58.0, centerLon: 25.0 };
        const url = buildSnapshotDronesUrl('/v1/drones', config);
        expect(url).toMatch(/^\/v1\/drones\?center=58%2C25/);
    });
});
