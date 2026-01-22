import { describe, it, expect } from 'vitest';
import { parseEnhancedCoordinate, parseEnhancedCoordinateChain } from './coordParsers';

describe('enhancedCoordParsers', () => {
  describe('parseEnhancedCoordinate', () => {
    it('should parse DMS format', () => {
      const result = parseEnhancedCoordinate('591633N 0261500E');
      expect(result).toEqual([26.25, 59.27583333333333]); // 59 deg 16.55 min, 26 deg 15.00 min
    });

    it('should parse decimal degrees format with direction first', () => {
      const result = parseEnhancedCoordinate('N59.1234 E024.5678');
      expect(result).toEqual([24.5678, 59.1234]);
    });

    it('should parse decimal degrees format with direction last', () => {
      const result = parseEnhancedCoordinate('59.1234N 024.5678E');
      expect(result).toEqual([24.5678, 59.1234]);
    });

    it('should parse decimal degrees format with suffix negative directions', () => {
      const result = parseEnhancedCoordinate('59.1234S 024.5678W');
      expect(result).toEqual([-24.5678, -59.1234]);
    });

    it('should parse DMS with spaces format', () => {
      const result = parseEnhancedCoordinate('N 59 12 34 E 024 56 78');
      expect(result).not.toBeNull();
      expect(result![0]).toBeCloseTo(24.955, 10);
      expect(result![1]).toBeCloseTo(59.20944444444445, 10);
    });

    it('should parse Degrees Decimal Minutes format', () => {
      const result = parseEnhancedCoordinate('N5945.123 E02430.456');
      expect(result).toEqual([24.5076, 59.75205]); // 24+30.456/60, 59+45.123/60
    });

    it('should handle negative coordinates (South/West)', () => {
      const result = parseEnhancedCoordinate('S59.1234 W024.5678');
      expect(result).toEqual([-24.5678, -59.1234]);
    });

    it('should return null for invalid coordinates', () => {
      const result = parseEnhancedCoordinate('invalid coordinate');
      expect(result).toBeNull();
    });
  });

  describe('parseEnhancedCoordinateChain', () => {
    it('should parse coordinate chain with dash separator', () => {
      const result = parseEnhancedCoordinateChain('N59.1234 E024.5678 - N59.2345 E024.6789');
      expect(result).not.toBeNull();
      expect(result!).toHaveLength(2);
      expect(result![0]).toEqual([24.5678, 59.1234]);
      expect(result![1]).toEqual([24.6789, 59.2345]);
    });

    it('should parse coordinate chain with comma separator', () => {
      const result = parseEnhancedCoordinateChain('N59.1234 E024.5678, N59.2345 E024.6789');
      expect(result).not.toBeNull();
      expect(result!).toHaveLength(2);
      expect(result![0]).toEqual([24.5678, 59.1234]);
      expect(result![1]).toEqual([24.6789, 59.2345]);
    });

    it('should parse coordinate chain with multiple formats', () => {
      const result = parseEnhancedCoordinateChain('591633N 0261500E - N59.2345 E024.6789');
      expect(result).not.toBeNull();
      expect(result!).toHaveLength(2);
      // First coordinate is DMS format
      expect(result![0][0]).toBeCloseTo(26.25, 2); // approximately 26.25
      expect(result![0][1]).toBeCloseTo(59.2758, 2); // approximately 59.2758
      // Second coordinate is decimal
      expect(result![1]).toEqual([24.6789, 59.2345]);
    });

    it('should return null for invalid chain', () => {
      const result = parseEnhancedCoordinateChain('invalid coordinate chain');
      expect(result).toBeNull();
    });
  });
});
