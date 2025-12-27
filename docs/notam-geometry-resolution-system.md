# NOTAM Geometry Resolution System

## Overview
The NOTAM geometry resolution system combines live NOTAM data with pre-parsed eAIP airspace geometry to provide accurate visualization of restricted areas. It implements a fallback chain: NOTAM geometry → eAIP polygon → circle approximation → no geometry.

## Architecture

### Resolution Order (Deterministic)
1. **NOTAM Geometry** - If NOTAM contains valid geometry → use it (source='notam')
2. **eAIP Dataset** - If NOTAM text contains designator (e.g. EER15D) and eAIP dataset has it → use eAIP polygon (source='aip') 
3. **Derived Circle** - If qualifiers contain coordinate+radius → use circle (source='derived')
4. **None** - Otherwise → geometry=none + error issue

### Data Types

#### NotamIssue
```typescript
interface NotamIssue {
  code: 'NO_GEOMETRY' | 'INVALID_GEOMETRY' | 'AIP_NOT_FOUND' | 'AIP_PARSE_UNSUPPORTED' | 'PROJECTION_MISMATCH' | 'RADIUS_UNIT_SUSPECT';
  severity: 'error' | 'warning';
  message: string;
  details?: Record<string, unknown>;
}
```

#### ResolvedNotamGeometry
```typescript
type ResolvedNotamGeometry =
  | { kind: 'geojson'; feature: GeoJSON.Feature; source: 'notam' | 'aip' | 'derived' }
  | { kind: 'none' };
```

#### EnhancedNotam
```typescript
interface EnhancedNotam extends NormalizedNotam {
  enhancedGeometry: NotamGeometry | null;
  sourceGeometry: NotamGeometry | null;
  geometrySource: 'eAIP' | 'parsed' | 'none';
  issues: string[];
}
```

## Implementation

### Services
- `AirspaceIntegrationService` - Loads and indexes eAIP data
- `useEnhancedNotamStream` - Combines NOTAM and eAIP data
- `NotamAirspaceIndex` - Maps designators to polygons

### Resolution Process
1. Extract designator from NOTAM text using regex: `/\b(EER\d+[A-Z]?|EED\d+[A-Z]?|EEP\d+[A-Z]?|EET\d+[A-Z]?)\b/gi`
2. Normalize designator (uppercase, remove spaces): "EER 15D" → "EER15D"
3. Look up in eAIP index
4. If found, use eAIP polygon geometry
5. If not found, use original NOTAM geometry or fallback

## Error Handling

### Issue Codes and Triggers
- `NO_GEOMETRY`: No geometry source available
- `INVALID_GEOMETRY`: Geometry fails validation (range, ring closure, etc.)
- `AIP_NOT_FOUND`: Designator found in NOTAM but not in eAIP dataset
- `AIP_PARSE_UNSUPPORTED`: eAIP geometry has unsupported format
- `PROJECTION_MISMATCH`: Coordinate system mismatch detected
- `RADIUS_UNIT_SUSPECT`: Radius value seems incorrect (e.g. 17 instead of 17NM)

### Fallback Rendering Rules
- **Valid Features**: Render normally with appropriate styling
- **Warning Features**: Render with yellow border, show warning icon
- **Error Features**: Render as red point at fallback location with "!" label and tooltip

## Frontend Integration

### Visualization
- **Polygons**: Display with orange outline and transparent fill for eAIP areas
- **Circles**: Display with dashed orange outline for derived areas
- **Points**: Display as red markers for unvisualizable areas

### UI Indicators
- **Green**: Valid geometry from NOTAM or eAIP
- **Yellow**: Derived circle from coordinate+radius
- **Red**: Error feature with fallback location

### Unvisualizable NOTAMs Display
- Collapsible section showing NOTAMs with geometry issues
- Error badges with specific issue codes
- Raw text display for debugging

## Validation

### Geometry Validation Checks
- **Ring Closure**: First and last points match
- **Minimum Points**: At least 4 points for valid polygon
- **Coordinate Ranges**: -180≤lon≤180, -90≤lat≤90
- **Coordinate Order**: [lon, lat] for EPSG:4326
- **Extent Sanity**: Within Estonian bounds (22°E-28°E, 57°N-60°N)

### Projection Handling
- **Source**: EPSG:4326 (WGS84) with [lon, lat] order
- **Target**: EPSG:3857 (Web Mercator) for OpenLayers rendering
- **Transformation**: Using `ol/format/GeoJSON` with explicit projections

## Testing

### Test Coverage
- Designator extraction accuracy
- Polygon lookup success rate
- Fallback chain functionality
- Error handling scenarios
- Coordinate validation

### Test Cases
- Valid designator matches
- Invalid designator handling
- Missing eAIP data fallback
- Geometry validation failures
- Multiple NOTAMs with same designator

## Performance

### Caching
- eAIP data cached by effective date
- Polygon index maintained in memory
- Efficient lookup by designator

### Optimization
- Lazy loading of eAIP data
- Memoization of enhanced NOTAMs
- Batch processing of geometry transformations