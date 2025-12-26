# Polygon NOTAM Support

## Overview
The VASIKAS system now supports rendering polygon and multi-polygon NOTAMs in addition to the existing circle NOTAMs. This enhancement allows for more accurate representation of complex NOTAM areas on the map.

## Supported Geometry Types

The system supports three types of NOTAM geometries:

1. **Circle** - Circular areas defined by a center point and radius
2. **Polygon** - Polygonal areas defined by a series of coordinate points forming a closed shape
3. **MultiPolygon** - Multiple polygonal areas combined into a single NOTAM

## Data Format

NOTAM geometries follow the GeoJSON specification format:

### Circle Format
```json
{
  "type": "circle",
  "center": {
    "lon": 24.7536,
    "lat": 59.4369
  },
  "radiusMeters": 1000
}
```

### Polygon Format
```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [24.74, 59.43],
      [24.76, 59.43],
      [24.76, 59.44],
      [24.74, 59.44],
      [24.74, 59.43]
    ]
  ]
}
```

### MultiPolygon Format
```json
{
  "type": "MultiPolygon",
  "coordinates": [
    [
      [
        [25.0, 60.0],
        [25.1, 60.0],
        [25.1, 60.1],
        [25.0, 60.1],
        [25.0, 60.0]
      ]
    ],
    [
      [
        [25.2, 60.2],
        [25.3, 60.2],
        [25.3, 60.3],
        [25.2, 60.3],
        [25.2, 60.2]
      ]
    ]
  ]
}
```

## Implementation Details

### Data Processing
- NOTAM geometry data is parsed in `src/services/notam/notamInterpreter.ts`
- The `parseNotamGeometry` function handles all three geometry types
- Geometry is converted to OpenLayers format in `notamGeometryToOl` function

### Map Rendering
- NOTAMs are rendered using the `createNotamLayer` in `src/map/layers/notams.ts`
- All geometry types use the same styling: orange outline with dashed lines and orange fill
- Labels showing NOTAM ID are displayed on the map

### Coordinate System
- Input coordinates use WGS-84 (longitude, latitude)
- Coordinates are converted to EPSG:3857 (Web Mercator) for map rendering

## Testing

The implementation includes comprehensive tests:
- `src/map/layers/controllers/notamGeometryToOl.test.ts` - Tests geometry conversion
- `src/map/layers/controllers/polygonNotamRendering.test.ts` - Tests polygon-specific rendering
- Mock data includes examples of all geometry types in `public/mock/notams.sample.json`

## Mock Data

The mock data file `public/mock/notams.sample.json` includes examples of:
- Circle NOTAM: A1234/25
- Polygon NOTAM: B5678/25
- MultiPolygon NOTAM: C9012/25

These examples ensure that all geometry types are properly tested and displayed during development.