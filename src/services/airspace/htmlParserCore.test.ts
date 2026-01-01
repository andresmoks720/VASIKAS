import { describe, it, expect } from 'vitest';
import { parseEaipEnr51Core, ParserElement, normalizeWindingOrder } from './htmlParserCore';

function createParserElement(textContent: string): ParserElement {
    return {
        textContent,
        innerHTML: null,
        querySelector: () => null,
        querySelectorAll: () => [],
        getAttribute: () => null,
    };
}

describe('htmlParserCore', () => {
    it('should encode multiple coordinate chains as separate polygons in a MultiPolygon', () => {
        // Mock root element
        const mockRow = {
            querySelectorAll: (selector: string) => {
                if (selector === 'td') {
                    return [
                        createParserElement('EER15 590000N 0240000E - 590000N 0250000E - 580000N 0250000E - 580000N 0240000E - 590000N 0240000E. 570000N 0260000E - 570000N 0270000E - 560000N 0270000E - 560000N 0260000E - 570000N 0260000E'),
                        createParserElement('FL100\nSFC'),
                        createParserElement('Remarks'),
                    ];
                }
                return [];
            },
            querySelector: (selector: string) => {
                if (selector === 'p strong') {
                    return { textContent: 'EER15' };
                }
                return null;
            }
        };

        const mockRoot = {
            querySelector: () => null,
            querySelectorAll: (selector: string) => {
                if (selector === 'tbody tr') {
                    return [mockRow];
                }
                return [];
            }
        } as unknown as ParserElement;

        const result = parseEaipEnr51Core(mockRoot, 'http://example.com');

        expect(result.features).toHaveLength(1);
        const feature = result.features[0];
        expect(feature.geometry.type).toBe('MultiPolygon');

        // Coordinates for MultiPolygon should be [ [ [ring1] ], [ [ring2] ] ]
        // Wait, GeoJSON MultiPolygon is [ Polygon, Polygon, ... ]
        // A Polygon is [ LinearRing, LinearRing, ... ]
        // So MultiPolygon is [ [ [L1], [H1] ], [ [L2] ] ]
        // Our fix: rings.map(ring => [ring])
        // If rings = [R1, R2], result = [ [R1], [R2] ]

        expect(feature.geometry.coordinates).toHaveLength(2);
        expect(feature.geometry.coordinates[0]).toHaveLength(1); // One outer ring for first polygon
        expect(feature.geometry.coordinates[1]).toHaveLength(1); // One outer ring for second polygon
    });

    it('should ensure outer rings are CCW (positive area)', () => {
        // CW ring (negative area in Shoelace if using standard Cartesian, 
        // but our implementation area += x1*y2 - x2*y1)
        // [0,0], [0,1], [1,1], [1,0], [0,0] -> CW
        // (0*1 - 0*0) + (0*1 - 1*1) + (1*0 - 1*1) + (1*0 - 0*0) = 0 + (-1) + (-1) + 0 = -2
        const cwRing: [number, number][] = [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]];

        normalizeWindingOrder(cwRing, true); // normalize to CCW

        // Should be reversed to [[0,0], [1,0], [1,1], [0,1], [0,0]]
        expect(cwRing[3]).toEqual([0, 1]);
    });

    it('should handle various coordinate separators and variable spacing', () => {
        const mockRow = {
            querySelectorAll: (selector: string) => {
                if (selector === 'td') {
                    return [
                        createParserElement('TESTAREA\n5900N 02400E – 5900N 02500E | 5800N 02500E\n5800N 02400E - 5900N 02400E'),
                        createParserElement('FL100\nSFC'),
                        createParserElement('Remarks'),
                    ];
                }
                return [];
            },
            querySelector: (selector: string) => {
                if (selector === 'p strong') return { textContent: 'TESTAREA' };
                return null;
            }
        };

        const mockRoot = {
            querySelector: () => null,
            querySelectorAll: (selector: string) => (selector === 'tbody tr' ? [mockRow] : [])
        } as unknown as ParserElement;

        const result = parseEaipEnr51Core(mockRoot, 'http://example.com');
        expect(result.features).toHaveLength(1);
        expect(result.features[0].geometry.type).toBe('Polygon');
        // Coordinates should have 5 points in the first ring (closed loop)
        expect(result.features[0].geometry.coordinates[0]).toHaveLength(5);
    });
});
