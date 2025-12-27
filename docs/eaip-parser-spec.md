# eAIP Parser Specification

## Overview
The eAIP parser extracts airspace geometry from Estonian eAIP ENR 5.1 pages and converts them to validated GeoJSON format.

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
- Format: HTML table with coordinate chains like `"591633N 0261500E - 591639N 0255647E"`

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

## Validation Rules

### Geometry Validation
- **Ring Closure**: First and last points must match
- **Minimum Points**: At least 4 points for valid polygon
- **Coordinate Range**: -180 ≤ lon ≤ 180, -90 ≤ lat ≤ 90
- **Coordinate Order**: [lon, lat] for EPSG:4326
- **BBox Sanity**: Within Estonian bounds (22°E-28°E, 57°N-60°N)

### Parsing Contract
- **Valid Chains**: Only parse coordinate chains in format `"DDMMSSN DDDMMSSEx - ..."`
- **Unsupported**: Text like "further along the state border" → AIP_PARSE_UNSUPPORTED
- **Errors**: Invalid coordinates → AIP_PARSE_ERROR

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

### Index Structure
```typescript
Map<string, GeoJSON.Feature> // designator -> feature
```

## Deterministic Outputs

### Metadata
- `effectiveDate`: From history page
- `sourceUrl`: Full URL of source
- `sha256`: Hash of raw HTML
- `generatedAt`: ISO timestamp
- `issues[]`: Array of validation issues

### File Structure
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