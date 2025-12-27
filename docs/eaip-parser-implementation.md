# eAIP Parser Implementation Guide

## Overview
The eAIP (Electronic Aeronautical Information Publication) parser extracts airspace geometry from Estonian eAIP ENR 5.1 pages and converts them to validated GeoJSON format for use in the application.

## Architecture

### Data Flow
1. **Discovery**: Scrape `eaip.eans.ee/history-en-GB.html` for current effective date
2. **Fetch**: Download ENR 5.1 HTML from generated URL
3. **Cache**: Save raw HTML to `data/cache/eaip/<date>/EE-ENR-5.1.html`
4. **Parse**: Extract designators and coordinate chains using Cheerio
5. **Convert**: Transform DMS coordinates to decimal degrees
6. **Validate**: Run geometry validation checks
7. **Index**: Build Map<designator, Feature> for runtime use

### Input Format
- Source: `https://eaip.eans.ee/history-en-GB.html` (for effective date)
- Target: `https://eaip.eans.ee/YYYY-MM-DD/html/eAIP/EE-ENR-5.1-en-GB.html`
- Format: HTML table with coordinate chains like `"591633N 0261500E - 591639N 0255647E - ..."`

### Output Format
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
  }],
  "metadata": {
    "effectiveDate": "YYYY-MM-DD",
    "sourceUrl": "...",
    "sha256": "...",
    "generatedAt": "...",
    "issues": ["..."]
  }
}
```

## Key Components

### 1. Parser (`tools/eaip-import/src/parser.ts`)
- Main parsing logic using Cheerio
- Coordinate conversion from DDMMSS to decimal degrees
- Geometry validation and normalization

### 2. Coordinate Conversion
- Handles DDMMSS format (e.g., "591633N 0261500E")
- Converts to decimal degrees with proper [lon, lat] ordering
- Validates coordinate ranges for Estonian airspace

### 3. Geometry Validation
- Ring closure validation
- Minimum point count (4 points for valid polygon)
- Coordinate range validation (-180≤lon≤180, -90≤lat≤90)
- Bounding box sanity checks (Estonian region: 22-28°E, 57-60°N)

### 4. Integration Service (`src/services/airspace/AirspaceIntegrationService.ts`)
- Matches NOTAM designators to eAIP polygons
- Enhances NOTAMs with accurate geometry
- Maintains fallback to original geometry

## Error Handling

### Issue Types
- `AIP_PARSE_UNSUPPORTED`: Complex geometry not supported
- `AIP_PARSE_ERROR`: Failed to parse coordinates
- `INVALID_GEOMETRY`: Failed validation checks
- `INVALID_COORDINATE`: Out of range coordinates
- `EXTENT_SANITY`: Outside plausible region

### Visibility
- Red badges in UI for errors/warnings
- Detailed issue messages in metadata
- Error markers on map with tooltips

## Runtime Integration

### NOTAM Geometry Resolution
1. Extract designator from NOTAM text (e.g., "EER15D")
2. Look up in airspace index
3. Attach polygon geometry if found
4. Fallback to circle (Q-line center/radius)
5. Otherwise "no geometry"

## File Structure
```
data/
├── airspace/
│   └── ee/
│       ├── <effectiveDate>/
│       │   └── enr5_1.geojson
│       └── latest.json
└── cache/
    └── eaip/
        └── <date>/
            └── EE-ENR-5.1.html
```

## Testing

### Unit Tests
- Coordinate parsing accuracy
- Boundary validation
- Error handling scenarios
- Estonian coordinate range verification

### Validation
- All coordinates in valid Estonian range (22-28°E, 57-60°N)
- Proper polygon ring closure
- Minimum 4 points per polygon
- Valid coordinate order [lon, lat]

## Deployment

### Automation
- Daily cron job to check for new effective dates
- Automatic parsing and validation
- File output to proper directory structure

### Monitoring
- Effective date extraction success rate
- Coordinate parsing accuracy
- Geometry validation pass rate
- File output integrity