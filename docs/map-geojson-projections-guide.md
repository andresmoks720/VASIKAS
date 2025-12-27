# Map GeoJSON and Projections Guide

## Overview
The map system handles spatial data in GeoJSON format with proper coordinate reference system (CRS) transformations between storage and rendering. This document outlines the CRS assumptions, projection handling, and validation requirements.

## Coordinate Reference Systems

### Storage Format (EPSG:4326)
- **System**: WGS84 Geographic Coordinate System
- **Units**: Decimal degrees
- **Axis Order**: [longitude, latitude] (X, Y)
- **Range**: 
  - Longitude: -180° to +180°
  - Latitude: -90° to +90°

### Rendering Format (EPSG:3857)
- **System**: Web Mercator (Spherical Mercator)
- **Units**: Meters
- **Axis Order**: [easting, northing] (X, Y)
- **Range**: 
  - X: ~-20,000,000 to +20,000,000 meters
  - Y: ~-20,000,000 to +20,000,000 meters

## OpenLayers Integration

### GeoJSON Format Configuration
```typescript
import GeoJSON from 'ol/format/GeoJSON';

const format = new GeoJSON({
  dataProjection: 'EPSG:4326',      // Source CRS (stored data)
  featureProjection: 'EPSG:3857'    // Target CRS (map view)
});
```

### Feature Transformation
```typescript
// Convert from stored format to map rendering
const features = format.readFeatures(geojsonData);

// Convert from map to stored format
const geoJsonString = format.writeFeatures(features, {
  featureProjection: 'EPSG:3857'
});
```

## Geometry Validation

### Coordinate Range Validation
- **Longitude**: -180.0 ≤ lon ≤ 180.0
- **Latitude**: -90.0 ≤ lat ≤ 90.0
- **Validation**: Performed during parsing and before rendering

### Polygon Validation
- **Minimum Points**: 4 points (3 unique + 1 closing)
- **Ring Closure**: First point ≈ Last point (within tolerance)
- **Right-Hand Rule**: Outer rings CCW, holes CW
- **Self-Intersection**: Checked with JSTS library

### Extent Validation (Estonian Region)
- **Longitude Bounds**: 22.0°E ≤ lon ≤ 28.0°E
- **Latitude Bounds**: 57.0°N ≤ lat ≤ 60.0°N
- **Validation**: Warn if outside bounds, error if significantly outside

## GeoJSON Schema Compliance

### FeatureCollection Structure
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[lon, lat], [lon, lat], ...]]
    },
    "properties": {
      "designator": "EER15D",
      "upperLimit": "FL95",
      "lowerLimit": "SFC",
      "remarks": "..."
    }
  }]
}
```

### Supported Geometry Types
- **Polygon**: Single ring (outer boundary)
- **MultiPolygon**: Multiple rings (disjoint areas)
- **Circle**: Converted to polygon with 64 sides during import

### Coordinate Ordering
- **Storage**: [longitude, latitude] (lon, lat) for EPSG:4326
- **Validation**: Always verify coordinate order during import
- **Conversion**: Maintain order during projection transformation

## Error Handling

### Invalid Geometry Detection
- **Out-of-range coordinates**: Flag with `INVALID_COORDINATE` issue
- **Insufficient points**: Flag with `INVALID_GEOMETRY` issue
- **Unclosed rings**: Auto-close with warning
- **Self-intersecting polygons**: Flag with `INVALID_GEOMETRY` issue

### Fallback Rendering
- **Valid Geometry**: Render as intended
- **Invalid Geometry**: Render as red error marker at centroid
- **No Geometry**: Show in unvisualizable section

## Performance Considerations

### Large Geometry Handling
- **Simplification**: Apply Douglas-Peucker algorithm for large polygons
- **Clustering**: Group nearby features for performance
- **Level of Detail**: Adjust detail based on zoom level

### Memory Management
- **Feature Culling**: Remove off-screen features from memory
- **Lazy Loading**: Load features only when needed
- **Batch Processing**: Process geometry in chunks

## Quality Assurance

### Validation Pipeline
1. **Schema Validation**: Verify GeoJSON structure
2. **Coordinate Validation**: Check ranges and order
3. **Geometry Validation**: Check polygon validity
4. **Extent Validation**: Verify within plausible bounds
5. **Topology Validation**: Check for overlaps/intersections

### Testing Requirements
- **Unit Tests**: Individual geometry validation functions
- **Integration Tests**: Full pipeline validation
- **Performance Tests**: Large geometry rendering
- **Regression Tests**: Coordinate transformation accuracy

## Debugging

### Common Issues
- **Coordinate Order**: [lat, lon] instead of [lon, lat]
- **Projection Mismatch**: EPSG:4326 vs EPSG:3857 confusion
- **Range Errors**: Coordinates outside valid ranges
- **Ring Closure**: Polygons not properly closed

### Diagnostic Tools
- **Console Logging**: Detailed validation errors
- **Visual Markers**: Red markers for invalid geometry
- **Metadata**: Issue tracking in feature properties
- **Export**: Invalid features to separate debug layer