import { describe, it, expect } from 'vitest';
import { AirspaceIntegrationService } from './AirspaceIntegrationService';

describe('AirspaceIntegrationService', () => {
    it('should correctly detect source type in setAirspaceData', () => {
        const service = new AirspaceIntegrationService();

        // Test date
        service.setAirspaceData([], '2025-01-01');
        expect(service.getLoadedSourceType()).toBe('geojson');
        expect(service.getEffectiveDate()).toBe('2025-01-01');

        // Test URL
        service.setAirspaceData([], 'https://example.com/aip');
        expect(service.getLoadedSourceType()).toBe('html');
        expect(service.getLoadedSourceUrl()).toBe('https://example.com/aip');

        // Test custom protocol/ID including / (heuristic should favor HTML/URL)
        service.setAirspaceData([], 'custom://protocol/path');
        expect(service.getLoadedSourceType()).toBe('html');

        // Test GeoJSON URL (new heuristic)
        service.setAirspaceData([], 'https://example.com/data/airspace.geojson');
        expect(service.getLoadedSourceType()).toBe('geojson');

        service.setAirspaceData([], '/data/airspace/ee/2025-01-01/enr5_1.geojson');
        expect(service.getLoadedSourceType()).toBe('geojson');
    });

    it('should sanitize HTML before hashing to ensure stable cache', () => {
        const service = new AirspaceIntegrationService();
        const computeSimpleHash = (html: string) =>
            (service as unknown as { computeSimpleHash: (value: string) => string }).computeSimpleHash(html);

        const html1 = '<html><body>Generated at: 2025-12-28 10:00:00<div id="content">Airspace Data</div></body></html>';
        const html2 = '<html><body>Generated at: 2025-12-28 11:00:00<div id="content">Airspace Data</div></body></html>';

        const hash1 = computeSimpleHash(html1);
        const hash2 = computeSimpleHash(html2);

        expect(hash1).toBe(hash2);

        const html3 = '<html><body><div id="content">Different Data</div></body></html>';
        const hash3 = computeSimpleHash(html3);
        expect(hash3).not.toBe(hash1);
    });

    it('should handle long timestamps during sanitization', () => {
        const service = new AirspaceIntegrationService();
        const computeSimpleHash = (html: string) =>
            (service as unknown as { computeSimpleHash: (value: string) => string }).computeSimpleHash(html);
        const html1 = '<div>Data 1735346347000</div>';
        const html2 = '<div>Data 1735346350000</div>';

        expect(computeSimpleHash(html1)).toBe(computeSimpleHash(html2));
    });
});
