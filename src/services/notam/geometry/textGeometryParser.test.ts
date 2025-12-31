import { describe, it, expect } from 'vitest';
import { parseGeometryFromNotamText } from './textGeometryParser';

describe('textGeometryParser', () => {
  describe('parseGeometryFromNotamText', () => {
    it('should parse coordinate chains from NOTAM text', () => {
      const text = "Area defined by 591633N 0261500E - 591639N 0255647E - 591614N 0254748E";
      const result = parseGeometryFromNotamText(text);
      
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe('polygon');
      expect(Array.isArray((result.geometry as any).rings)).toBe(true);
    });

    it('should parse circle from radius pattern', () => {
      const text = "Circular area of radius 5NM from point 591633N 0261500E";
      const result = parseGeometryFromNotamText(text);
      
      expect(result.geometry).not.toBeNull();
      expect(result.geometry?.kind).toBe('circle');
      expect((result.geometry as any).radiusMeters).toBe(5 * 1852); // 5 NM in meters
    });

    it('should handle text with no geometry', () => {
      const text = "This is a NOTAM about maintenance work";
      const result = parseGeometryFromNotamText(text);
      
      expect(result.geometry).toBeNull();
      expect(result.reason).toBe('NO_GEOMETRY_IN_TEXT');
    });

    it('should parse coordinates in EANS format', () => {
      const text = "Area around 5925N02450E with radius 3NM";
      const result = parseGeometryFromNotamText(text);
      
      expect(result.geometry).not.toBeNull();
    });

    it('should parse coordinates in decimal format', () => {
      const text = "Operations within N059.1234 E024.5678 with 2km radius";
      const result = parseGeometryFromNotamText(text);
      
      expect(result.geometry).not.toBeNull();
    });
  });
});