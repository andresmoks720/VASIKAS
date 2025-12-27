import type { AirspaceFeature } from "./airspaceTypes";

/**
 * Validates that an AirspaceFeature conforms to the expected contract
 * Checks basic invariants like coordinate ranges, ring closure, and geometry shape
 */
export function validateAirspaceFeatureContract(feature: AirspaceFeature): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check that feature has required properties
  if (!feature.type || feature.type !== 'Feature') {
    issues.push(`Invalid feature type: ${feature.type}`);
  }

  if (!feature.geometry) {
    issues.push('Missing geometry property');
    return { valid: false, issues };
  }

  // Validate geometry structure
  if (!feature.geometry.type) {
    issues.push('Geometry missing type property');
  }

  if (!feature.geometry.coordinates) {
    issues.push('Geometry missing coordinates property');
  }

  // Validate coordinates based on geometry type
  if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates) {
    const rings = feature.geometry.coordinates as number[][][];
    
    if (!Array.isArray(rings) || rings.length === 0) {
      issues.push('Polygon geometry has no rings');
    } else {
      for (let i = 0; i < rings.length; i++) {
        const ring = rings[i];
        if (!Array.isArray(ring) || ring.length < 3) {
          issues.push(`Polygon ring ${i} has fewer than 3 points: ${ring.length}`);
          continue;
        }

        // Check coordinate format [lon, lat]
        for (let j = 0; j < ring.length; j++) {
          const coord = ring[j];
          if (!Array.isArray(coord) || coord.length < 2) {
            issues.push(`Polygon ring ${i} point ${j} is not a valid coordinate: ${coord}`);
            continue;
          }

          const [lon, lat] = coord;
          if (typeof lon !== 'number' || typeof lat !== 'number') {
            issues.push(`Polygon ring ${i} point ${j} has non-numeric coordinates: [${lon}, ${lat}]`);
            continue;
          }

          // Validate coordinate ranges
          if (Math.abs(lon) > 180) {
            issues.push(`Polygon ring ${i} point ${j} longitude out of range: ${lon}`);
          }
          if (Math.abs(lat) > 90) {
            issues.push(`Polygon ring ${i} point ${j} latitude out of range: ${lat}`);
          }
        }

        // Check ring closure (first and last points should be the same)
        if (ring.length >= 3) {
          const first = ring[0];
          const last = ring[ring.length - 1];
          const tolerance = 0.000001;

          if (Math.abs(first[0] - last[0]) > tolerance || Math.abs(first[1] - last[1]) > tolerance) {
            issues.push(`Polygon ring ${i} is not closed (first and last points differ)`);
          }
        }
      }
    }
  } else if (feature.geometry.type === 'MultiPolygon' && feature.geometry.coordinates) {
    const polygons = feature.geometry.coordinates as number[][][][];
    
    if (!Array.isArray(polygons) || polygons.length === 0) {
      issues.push('MultiPolygon geometry has no polygons');
    } else {
      for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        if (!Array.isArray(polygon) || polygon.length === 0) {
          issues.push(`MultiPolygon polygon ${i} has no rings`);
          continue;
        }

        for (let j = 0; j < polygon.length; j++) {
          const ring = polygon[j];
          if (!Array.isArray(ring) || ring.length < 3) {
            issues.push(`MultiPolygon polygon ${i} ring ${j} has fewer than 3 points: ${ring.length}`);
            continue;
          }

          // Check coordinate format [lon, lat] and ranges
          for (let k = 0; k < ring.length; k++) {
            const coord = ring[k];
            if (!Array.isArray(coord) || coord.length < 2) {
              issues.push(`MultiPolygon polygon ${i} ring ${j} point ${k} is not a valid coordinate: ${coord}`);
              continue;
            }

            const [lon, lat] = coord;
            if (typeof lon !== 'number' || typeof lat !== 'number') {
              issues.push(`MultiPolygon polygon ${i} ring ${j} point ${k} has non-numeric coordinates: [${lon}, ${lat}]`);
              continue;
            }

            if (Math.abs(lon) > 180) {
              issues.push(`MultiPolygon polygon ${i} ring ${j} point ${k} longitude out of range: ${lon}`);
            }
            if (Math.abs(lat) > 90) {
              issues.push(`MultiPolygon polygon ${i} ring ${j} point ${k} latitude out of range: ${lat}`);
            }
          }

          // Check ring closure
          if (ring.length >= 3) {
            const first = ring[0];
            const last = ring[ring.length - 1];
            const tolerance = 0.000001;
            
            if (Math.abs(first[0] - last[0]) > tolerance || Math.abs(first[1] - last[1]) > tolerance) {
              issues.push(`MultiPolygon polygon ${i} ring ${j} is not closed`);
            }
          }
        }
      }
    }
  } else if (feature.geometry.type === 'Point' && feature.geometry.coordinates) {
    const coord = feature.geometry.coordinates as [number, number];
    
    if (!Array.isArray(coord) || coord.length < 2) {
      issues.push('Point geometry has invalid coordinates');
    } else {
      const [lon, lat] = coord;
      if (typeof lon !== 'number' || typeof lat !== 'number') {
        issues.push(`Point geometry has non-numeric coordinates: [${lon}, ${lat}]`);
      } else {
        if (Math.abs(lon) > 180) {
          issues.push(`Point longitude out of range: ${lon}`);
        }
        if (Math.abs(lat) > 90) {
          issues.push(`Point latitude out of range: ${lat}`);
        }
      }
    }
  }

  // Validate properties exist
  if (!feature.properties) {
    issues.push('Missing properties object');
  } else {
    // Check for essential properties depending on use case
    if (typeof feature.properties.designator !== 'string') {
      issues.push('Missing or invalid designator property');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate an array of AirspaceFeatures
 */
export function validateAirspaceFeaturesContract(features: AirspaceFeature[]): { valid: boolean; issues: string[] } {
  const allIssues: string[] = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const { valid, issues } = validateAirspaceFeatureContract(feature);
    
    if (!valid) {
      allIssues.push(`Feature ${i}: ${issues.join(', ')}`);
    }
  }

  return {
    valid: allIssues.length === 0,
    issues: allIssues
  };
}