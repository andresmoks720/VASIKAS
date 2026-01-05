import type { NotamGeometry } from "../notamTypes";

export interface PolygonValidationResult {
  isValid: boolean;
  issues: string[];
  corrected?: NotamGeometry;
}

/**
 * Validates polygon geometry for proper formation
 * Checks for closed rings, correct winding order, and minimum point requirements
 */
export function validatePolygonGeometry(geometry: NotamGeometry): PolygonValidationResult {
  if (!geometry) {
    return { isValid: false, issues: ["Geometry is null or undefined"] };
  }

  if (geometry.kind === "circle") {
    // Circles are always valid
    return { isValid: true, issues: [] };
  }

  if (geometry.kind === "polygon") {
    // Validate each ring in the polygon
    const validatedRings = geometry.rings.map((ring, index) => {
      const ringIssues: string[] = [];
      
      // Check minimum points
      if (ring.length < 3) {
        ringIssues.push(`Ring ${index} has fewer than 3 points`);
      } else if (ring.length < 4) {
        // A closed ring needs at least 4 points (3 unique + 1 closing)
        ringIssues.push(`Ring ${index} has fewer than 4 points (needs at least 4 for a closed ring)`);
      }
      
      // Check ring closure
      if (ring.length >= 4) {
        const firstPoint = ring[0];
        const lastPoint = ring[ring.length - 1];
        const tolerance = 0.000001;
        
        const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
                        Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;
        
        if (!isClosed) {
          ringIssues.push(`Ring ${index} is not closed`);
        }
      }
      
      // Check winding order for outer rings (should be counter-clockwise)
      if (ring.length >= 4) {
        const isClockwise = isRingClockwise(ring);
        if (index === 0 && isClockwise) { // Outer ring should be counter-clockwise
          ringIssues.push(`Outer ring ${index} has clockwise winding order (should be counter-clockwise)`);
        } else if (index > 0 && !isClockwise) { // Inner rings (holes) should be clockwise
          ringIssues.push(`Inner ring ${index} has counter-clockwise winding order (should be clockwise)`);
        }
      }
      
      return {
        ring,
        issues: ringIssues,
        isValid: ringIssues.length === 0
      };
    });
    
    const allIssues = validatedRings.flatMap(r => r.issues);
    
    // If there are issues, we can try to correct them
    if (allIssues.length > 0) {
      const correctedRings = validatedRings.map(r => {
        let correctedRing = [...r.ring];
        
        // Fix ring closure if needed
        if (r.issues.some(issue => issue.includes('not closed'))) {
          correctedRing = ensureRingClosure(correctedRing);
        }
        
        // Fix winding order if needed
        if (r.issues.some(issue => issue.includes('winding order'))) {
          correctedRing = ensureCorrectWindingOrder(correctedRing, r.ring === geometry.rings[0]);
        }
        
        return correctedRing;
      });
      
      return {
        isValid: false,
        issues: allIssues,
        corrected: {
          kind: "polygon",
          rings: correctedRings
        }
      };
    }
    
    return { isValid: validatedRings.every(r => r.isValid), issues: allIssues };
  }
  
  if (geometry.kind === "multiPolygon") {
    const issues: string[] = [];
    
    for (let i = 0; i < geometry.polygons.length; i++) {
      const polygon = geometry.polygons[i];
      const polygonIssues: string[] = [];
      
      for (let j = 0; j < polygon.length; j++) {
        const ring = polygon[j];
        
        // Check minimum points
        if (ring.length < 3) {
          polygonIssues.push(`Polygon ${i}, ring ${j} has fewer than 3 points`);
        } else if (ring.length < 4) {
          polygonIssues.push(`Polygon ${i}, ring ${j} has fewer than 4 points (needs at least 4 for a closed ring)`);
        }
        
        // Check ring closure
        if (ring.length >= 4) {
          const firstPoint = ring[0];
          const lastPoint = ring[ring.length - 1];
          const tolerance = 0.000001;
          
          const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
                          Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;
          
          if (!isClosed) {
            polygonIssues.push(`Polygon ${i}, ring ${j} is not closed`);
          }
        }
        
        // Check winding order for outer rings
        if (ring.length >= 4) {
          const isClockwise = isRingClockwise(ring);
          if (j === 0 && isClockwise) { // Outer ring should be counter-clockwise
            polygonIssues.push(`Polygon ${i}, outer ring ${j} has clockwise winding order (should be counter-clockwise)`);
          } else if (j > 0 && !isClockwise) { // Inner rings (holes) should be clockwise
            polygonIssues.push(`Polygon ${i}, inner ring ${j} has counter-clockwise winding order (should be clockwise)`);
          }
        }
      }
      
      issues.push(...polygonIssues);
    }
    
    return { isValid: issues.length === 0, issues };
  }
  
  // For non-polygon geometries, return as valid
  return { isValid: true, issues: [] };
}

/**
 * Checks if a ring has clockwise winding order using the shoelace formula
 */
function isRingClockwise(ring: [number, number][]): boolean {
  if (ring.length < 3) return false;
  
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += (x2 - x1) * (y2 + y1);
  }
  
  return sum > 0;
}

/**
 * Ensures a ring is properly closed by adding the first point to the end if needed
 */
function ensureRingClosure(ring: [number, number][]): [number, number][] {
  if (ring.length < 2) return ring;
  
  const firstPoint = ring[0];
  const lastPoint = ring[ring.length - 1];
  const tolerance = 0.000001;
  
  const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
                  Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;
  
  if (!isClosed) {
    return [...ring, firstPoint];
  }
  
  return ring;
}

/**
 * Ensures a ring has the correct winding order
 * @param ring The ring coordinates
 * @param isOuterRing Whether this is an outer ring (true) or inner ring/hole (false)
 */
function ensureCorrectWindingOrder(ring: [number, number][], isOuterRing: boolean): [number, number][] {
  const isClockwise = isRingClockwise(ring);
  const shouldBeClockwise = !isOuterRing; // Outer rings should be CCW (not clockwise), inner rings should be CW
  
  if (isClockwise !== shouldBeClockwise) {
    // Reverse the ring to correct the winding order
    return [...ring].reverse();
  }
  
  return ring;
}
