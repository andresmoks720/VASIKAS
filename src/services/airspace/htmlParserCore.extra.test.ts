
import { describe, it, expect } from 'vitest';
import { parseDms, parseCoordinateChain } from './htmlParserCore';

describe('htmlParserCore - coordinate parsing', () => {
    describe('parseDms', () => {
        it('should handle standard 7-digit longitude (0241030E)', () => {
            const result = parseDms('0241030', false, true);
            expect(result).toBeCloseTo(24.175, 5);
        });

        it('should handle 6-digit longitude (241030E) as implied leading zero', () => {
            const result = parseDms('241030', false, true);
            expect(result).toBeCloseTo(24.175, 5);
        });

        it('should handle 6-digit latitude (592515N)', () => {
            const result = parseDms('592515', false, false);
            expect(result).toBeCloseTo(59.42083, 5);
        });

        it('should return null for invalid DMS strings', () => {
            expect(parseDms('123', false, false)).toBeNull();
        });
    });

    describe('parseCoordinateChain', () => {
        it('should parse a chain of coordinates with standard DMS', () => {
            // A closed loop: A -> B -> C -> A
            const chain = '590000N 0240000E - 590000N 0241000E - 580000N 0240000E - 590000N 0240000E';
            const result = parseCoordinateChain(chain);

            // Should return 1 ring
            expect(result).toHaveLength(1);

            const ring = result![0];
            // 4 points (A, B, C, A)
            expect(ring).toHaveLength(4);

            // Check first point (59N, 24E)
            expect(ring[0][1]).toBeCloseTo(59.0, 5);
            expect(ring[0][0]).toBeCloseTo(24.0, 5);
        });

        it('should parse a chain with 6-digit longitudes', () => {
            // A closed loop: A -> B -> C -> A
            const chain = '592515N 241030E - 592615N 241130E - 590000N 240000E - 592515N 241030E';
            const result = parseCoordinateChain(chain);

            expect(result).toHaveLength(1);
            const ring = result![0];
            expect(ring).toHaveLength(4);

            expect(ring[0][0]).toBeCloseTo(24.175, 5);
            expect(ring[1][0]).toBeCloseTo(24.19166, 4);
        });
    });
});
