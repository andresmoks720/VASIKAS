import { describe, it, expect } from 'vitest';
import { NotamAirspaceIndex } from './NotamAirspaceIndex';
import { NormalizedNotam } from './notamTypes';
import { AirspaceFeature } from '../airspace/airspaceTypes';

describe('NotamAirspaceIndex', () => {
    it('should use dynamic metadata when enhancing NOTAMs', () => {
        const index = new NotamAirspaceIndex();
        const mockFeatures: AirspaceFeature[] = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                },
                properties: {
                    designator: 'EER15D',
                    upperLimit: 'FL100',
                    lowerLimit: 'SFC',
                    sourceUrl: 'http://example.com'
                }
            }
        ];

        index.loadAirspaceData(mockFeatures, 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            {
                id: 'A1234/25',
                summary: 'RESTRICTED AREA EER15D ACTIVE',
                text: 'RESTRICTED AREA EER15D ACTIVE',
                validFromUtc: '2025-12-28T00:00:00Z',
                validToUtc: '2025-12-28T23:59:59Z',
                altitudes: [],
                geometry: null,
                geometrySource: 'notamText',
                eventTimeUtc: '2025-12-28T00:00:00Z',
                raw: {}
            }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);

        expect(enhanced[0].geometrySource).toBe('html');
        expect(enhanced[0].geometrySourceDetails?.effectiveDate).toBe('2025-12-28');
        expect(enhanced[0].enhancedGeometry).not.toBeNull();
    });

    it('should preserve original source when enhancement fails', () => {
        const index = new NotamAirspaceIndex();
        index.loadAirspaceData([], 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            {
                id: 'A1234/25',
                summary: 'NO MATCH',
                text: 'NO MATCH',
                geometry: { kind: 'circle', center: [0, 0], radiusMeters: 1000 },
                geometrySource: 'notamText',
                altitudes: [],
                eventTimeUtc: '2025-12-28T00:00:00Z',
                raw: {}
            }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);

        expect(enhanced[0].geometrySource).toBe('notamText');
        expect(enhanced[0].enhancedGeometry).toBeNull();
        expect(enhanced[0].sourceGeometry).toEqual(mockNotams[0].geometry);
    });

    it('should merge multiple airspace features for the same designator into a MultiPolygon', () => {
        const index = new NotamAirspaceIndex();
        const mockFeatures: AirspaceFeature[] = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                },
                properties: {
                    designator: 'EER15',
                    upperLimit: 'FL100',
                    lowerLimit: 'SFC',
                    sourceUrl: 'http://example.com/1'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]]]
                },
                properties: {
                    designator: 'EER15',
                    upperLimit: 'FL200',
                    lowerLimit: 'GND',
                    sourceUrl: 'http://example.com/2'
                }
            }
        ];

        index.loadAirspaceData(mockFeatures, 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            {
                id: 'A5555/25',
                summary: 'EER15 ACTIVE',
                text: 'EER15 ACTIVE',
                altitudes: [],
                geometry: null,
                geometrySource: 'none',
                eventTimeUtc: '2025-12-28T00:00:00Z',
                raw: {}
            }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);

        expect(enhanced[0].enhancedGeometry?.kind).toBe('multiPolygon');
        if (enhanced[0].enhancedGeometry?.kind === 'multiPolygon') {
            expect(enhanced[0].enhancedGeometry.polygons).toHaveLength(2);
        }
        expect(enhanced[0].geometrySourceDetails?.issues).toContain('MULTI_PART_AIRSPACE (2 parts)');
    });
    it('should extract broadened designators like TSA, TRA, CBA with spaces', () => {
        const index = new NotamAirspaceIndex();
        const mockFeatures: AirspaceFeature[] = [
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
                },
                properties: {
                    designator: 'TSA4A',
                    upperLimit: 'FL100',
                    lowerLimit: 'SFC'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[[5, 5], [6, 5], [6, 6], [5, 6], [5, 5]]]
                },
                properties: {
                    designator: 'TRA12',
                    upperLimit: 'FL200',
                    lowerLimit: 'GND'
                }
            }
        ];

        index.loadAirspaceData(mockFeatures, 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            {
                id: 'A6666/25',
                summary: 'TSA 4A ACTIVE',
                text: 'TSA 4A ACTIVE',
                altitudes: [],
                geometry: null,
                geometrySource: 'none',
                eventTimeUtc: '2025-12-28T00:00:00Z',
                raw: {}
            },
            {
                id: 'A7777/25',
                summary: 'TRA12 RESERVED',
                text: 'TRA12 RESERVED',
                altitudes: [],
                geometry: null,
                geometrySource: 'none',
                eventTimeUtc: '2025-12-28T00:00:00Z',
                raw: {}
            }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);

        expect(enhanced[0].enhancedGeometry).not.toBeNull();
        expect(enhanced[0].geometrySourceDetails?.source).toBe('html');
        expect(enhanced[1].enhancedGeometry).not.toBeNull();
    });

    it('should extract TMA and CTR designators and handle alternative phrasings', () => {
        const index = new NotamAirspaceIndex();
        const mockFeatures: AirspaceFeature[] = [
            {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
                properties: { designator: 'TMA1', upperLimit: 'FL100', lowerLimit: '2500FT' }
            },
            {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[5, 5], [6, 5], [6, 6], [5, 6], [5, 5]]] },
                properties: { designator: 'CTRTARTU', upperLimit: 'FL050', lowerLimit: 'GND' }
            }
        ];

        index.loadAirspaceData(mockFeatures, 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            { id: '1', text: 'AREA TMA 1 ACTIVE', summary: '', altitudes: [], geometry: null, geometrySource: 'none', eventTimeUtc: '', raw: {} },
            { id: '2', text: 'IN CTR TARTU', summary: '', altitudes: [], geometry: null, geometrySource: 'none', eventTimeUtc: '', raw: {} }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);
        expect(enhanced[0].enhancedGeometry).not.toBeNull();
        expect(enhanced[1].enhancedGeometry).not.toBeNull();
    });

    it('should normalize designators with hyphens and underscores', () => {
        const index = new NotamAirspaceIndex();
        const mockFeatures: AirspaceFeature[] = [
            {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
                properties: { designator: 'EER15', upperLimit: 'FL100', lowerLimit: 'SFC' }
            }
        ];

        index.loadAirspaceData(mockFeatures, 'html', '2025-12-28');

        const mockNotams: NormalizedNotam[] = [
            { id: '1', text: 'EE-R15 ACTIVE', summary: '', altitudes: [], geometry: null, geometrySource: 'none', eventTimeUtc: '', raw: {} },
            { id: '2', text: 'EE_R15 ACTIVE', summary: '', altitudes: [], geometry: null, geometrySource: 'none', eventTimeUtc: '', raw: {} }
        ];

        const enhanced = index.enhanceNotamsWithAirspace(mockNotams);
        expect(enhanced[0].enhancedGeometry).not.toBeNull();
        expect(enhanced[1].enhancedGeometry).not.toBeNull();
    });
});
