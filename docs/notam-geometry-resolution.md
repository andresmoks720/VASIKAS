# NOTAM Geometry Resolution

## Overview
This document describes how NOTAM geometry is resolved using multiple data sources with a prioritized fallback system.

## Resolution Order (Deterministic)

1. **NOTAM Geometry** - If NOTAM already contains polygon/multipolygon → use it (source='notam')
2. **AIP Dataset** - If NOTAM text contains designator (e.g. EER15D) and AIP dataset has it → use AIP polygon (source='aip') 
3. **Derived Circle** - If qualifiers contain coordinate+radius → use circle (source='derived')
4. **None** - Otherwise → geometry=none + error issue

## Data Types

### NotamIssue
```typescript
type NotamIssue = {
  code: 'NO_GEOMETRY'|'INVALID_GEOMETRY'|'AIP_NOT_FOUND'|'AIP_PARSE_UNSUPPORTED'|'PROJECTION_MISMATCH'|'RADIUS_UNIT_SUSPECT';
  severity: 'error'|'warning';
  message: string;
  details?: Record<string, unknown>;
};
```

### ResolvedNotamGeometry
```typescript
type ResolvedNotamGeometry =
  | { kind: 'geojson'; feature: GeoJSON.Feature; source: 'notam'|'aip'|'derived' }
  | { kind: 'none' };
```

### NormalizedNotam
```typescript
type NormalizedNotam = {
  id: string;
  designator?: string; // e.g. EER15D parsed from NOTAM text
  geometry: ResolvedNotamGeometry;
  issues: NotamIssue[];
};
```

## Issue Codes and Triggers

### NO_GEOMETRY
- **Trigger**: No geometry source available
- **Severity**: Error
- **Message**: "No geometry available for NOTAM"

### INVALID_GEOMETRY
- **Trigger**: Geometry fails validation (coordinate ranges, ring closure, etc.)
- **Severity**: Error
- **Message**: "Invalid geometry: [specific validation error]"

### AIP_NOT_FOUND
- **Trigger**: Designator found in NOTAM but not in AIP dataset
- **Severity**: Error
- **Message**: "AIP geometry not found for designator: [designator]"

### AIP_PARSE_UNSUPPORTED
- **Trigger**: AIP geometry has unsupported format (e.g. "further along the border")
- **Severity**: Error
- **Message**: "AIP geometry has unsupported format"

### PROJECTION_MISMATCH
- **Trigger**: Coordinate system mismatch detected
- **Severity**: Error
- **Message**: "Projection mismatch detected"

### RADIUS_UNIT_SUSPECT
- **Trigger**: Radius value seems incorrect (e.g. 17 instead of 17NM)
- **Severity**: Warning
- **Message**: "Radius unit may be incorrect, assuming nautical miles"

## Fallback Rendering Rules

### Error Features
- Render as red point at fallback location:
  - If qualifiers coordinate exists → point there
  - Else centroid of FIR bbox
- Style: red stroke/fill + "!" label + tooltip with issue messages

### Warning Features
- Render normally but with yellow border
- Add warning icon in UI

### Valid Features
- Render normally with appropriate styling based on type

## User-Visible Expectations

### Map Display
- ✅ Green: Valid geometry from NOTAM or AIP
- 🟡 Yellow: Derived circle from coordinate+radius
- 🔴 Red: Error feature with fallback location

### Panel Display
- Status chips showing geometry resolution status
- Detailed issue messages on hover/click
- Clear indication of fallback usage