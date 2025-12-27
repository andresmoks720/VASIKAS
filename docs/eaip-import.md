# eAIP Import Tool

## Overview
The eAIP Import Tool extracts airspace geometry from Estonian eAIP ENR 5.1 pages and converts them to GeoJSON format for use in the application.

## Data Source
- **URL**: https://eaip.eans.ee/history-en-GB.html
- **Effective Date Extraction**: Parse "Currently Effective Issue" effective date (e.g. 25 DEC 2025)
- **ENR 5.1 URL Pattern**: https://eaip.eans.ee/<YYYY-MM-DD>/html/eAIP/EE-ENR-5.1-en-GB.html

## Parsing Rules

### Supported Patterns
- Coordinate chains in format: `<coords> - <coords> - ... - <coords>`
- Example: `591633N 0261500E - 591639N 0255647E - 591614N 0254748E`
- Coordinate format: DDMMSSN DDDMMSSE (degrees-minutes-seconds with direction)

### Unsupported Cases
- Text containing "further along the state border"
- Text containing "along the territory dividing line" 
- Complex geometry descriptions that cannot be converted to coordinate chains
- Areas marked as "NIL" (no restricted areas)

### Coordinate Conversion
- Latitude: DD° MM' SS" (2 digits for degrees)
- Longitude: DDD° MM' SS" (3 or 4 digits for degrees)
- Output: Decimal degrees in EPSG:4326 with [lon, lat] order

## Output Schema

### GeoJSON Feature
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lon, lat], [lon, lat], ...]]
  },
  "properties": {
    "designator": "EER15D",
    "upperLimit": "FL95",
    "lowerLimit": "SFC", 
    "remarks": "Military air operations...",
    "sourceUrl": "https://eaip.eans.ee/..."
  }
}
```

### Metadata File (latest.json)
```json
{
  "effectiveDate": "YYYY-MM-DD",
  "sourceUrl": "https://eaip.eans.ee/...",
  "generatedAt": "ISO timestamp",
  "sha256": "HTML checksum",
  "featureCount": 84,
  "issueCount": 1
}
```

## File Structure
- `data/airspace/ee/<effectiveDate>/enr5_1.geojson` - Feature collection for specific date
- `data/airspace/ee/latest.json` - Metadata for current effective date

## Error Handling
- `AIP_PARSE_UNSUPPORTED`: Complex geometry that cannot be parsed
- `AIP_PARSE_ERROR`: Failed to parse coordinates for area
- Issues are logged with detailed descriptions for debugging