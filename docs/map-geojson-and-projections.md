# Map GeoJSON and Projections

## Overview
This document describes the coordinate reference system (CRS) assumptions and projection handling for map rendering.

## CRS Assumptions

### Storage Format
- **Coordinate System**: EPSG:4326 (WGS84)
- **Coordinate Order**: [longitude, latitude] (lon/lat)
- **Data Format**: GeoJSON FeatureCollection
- **Validation**: All geometries must pass coordinate range validation

### Rendering Pipeline
- **Source Projection**: EPSG:4326 (WGS84)
- **Target Projection**: EPSG:3857 (Web Mercator) - default OpenLayers view
- **Transformation**: Always use OpenLayers GeoJSON format with explicit projections

## OpenLayers Integration

### GeoJSON Format Usage
```javascript
import GeoJSON from 'ol/format/GeoJSON';

const format = new GeoJSON({
  dataProjection: 'EPSG:4326',      // Source CRS (stored data)
  featureProjection: view.getProjection()  // Target CRS (map view)
});

const features = format.readFeatures(geojsonData);
```

### Coordinate Order
- **Input**: [longitude, latitude] (OpenLayers expects this for EPSG:4326)
- **Validation**: Always ensure coordinate order is lon/lat for EPSG:4326 inputs
- **Reference**: https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON-GeoJSON.html

## Ring Orientation

### Right-Hand Rule
- **Outer Rings**: Counter-clockwise (CCW) orientation
- **Inner Rings (Holes)**: Clockwise (CW) orientation
- **Validation**: Use ring orientation validation to ensure proper rendering
- **Reference**: https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON-GeoJSON.html

### Polygon Validation
```javascript
// Ensure proper ring orientation
function validateRingOrientation(polygonCoords) {
  const [exteriorRing] = polygonCoords;
  // Exterior ring should be CCW
  const isCCW = calculateArea(exteriorRing) > 0;
  return isCCW;
}
```

## Geometry Validation

### Coordinate Range Validation
- **Longitude**: -180.0 to +180.0 degrees
- **Latitude**: -90.0 to +90.0 degrees
- **Validation**: Check ranges before rendering

### Minimum Point Validation
- **Polygons**: Minimum 4 points (3 unique + 1 closing point)
- **Lines**: Minimum 2 points
- **Validation**: Ensure minimum point requirements

### Extent Validation
- **Expected Region**: Estonian airspace (approximately 22°E to 28°E, 57°N to 60°N)
- **Sanity Check**: Verify geometry extent is within plausible bounds
- **Alert**: Flag geometries outside expected region as potential coordinate swap

## Error Handling

### Invalid Geometry
- **Detection**: Coordinate range violations, insufficient points, invalid ring orientation
- **Fallback**: Render error marker at centroid or fallback location
- **Styling**: Red error features with clear visual indicators

### Projection Mismatch
- **Detection**: When features don't appear in expected location
- **Solution**: Ensure proper projection transformation using format options
- **Debug**: Log projection details for troubleshooting

## Best Practices

### Data Loading
1. Always specify `dataProjection` and `featureProjection` when reading GeoJSON
2. Validate coordinate ranges before rendering
3. Check ring orientation for polygons
4. Verify minimum point counts

### Error Features
1. Render red error markers for invalid geometry
2. Include tooltip with specific error details
3. Provide fallback location when possible
4. Use consistent styling for error states