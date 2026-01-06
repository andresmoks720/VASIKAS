# GeoJSON System Architecture

## Overview

This system creates a unified JSON format that combines NOTAM data with geometry data from separate sources, following the reference implementation in `/parser_proto` but with enhanced data integration capabilities.

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                  GeoJSON Unified Data System                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ↓
         ┌─────────────────────┴─────────────────────┐
         │                                            │
         ↓                                            ↓
┌──────────────────┐                      ┌──────────────────┐
│  NOTAM Data      │                      │  Geometry Data   │
│  (EANS API)      │                      │  (EAIP-HTML)     │
└──────────────────┘                      └──────────────────┘
         │                                            │
         │ JSON                                      │ GeoJSON/HTML
         ↓                                            ↓
┌──────────────────────────────────────────────────────────┐
│              Data Processing & Integration Layer          │
├──────────────────────────────────────────────────────────┤
│  • NOTAM Parser        - Parse NOTAM text and metadata    │
│  • Geometry Parser     - Extract coordinates from HTML   │
│  • Altitude Converter  - Convert altitude units          │
│  • Data Combiner       - Merge NOTAM + Geometry          │
│  • Validation          - Ensure data quality             │
└──────────────────────────────────────────────────────────┘
                               │
                               ↓
                       ┌───────────────┐
                       │  Unified JSON │
                       │  Output       │
                       └───────────────┘
```

## Data Flow

```
User Request
     │
     ↓
┌─────────────────────────────────────────────┐
│ 1. Fetch NOTAM Data                          │
│    Source: EANS API (area24.json)             │
│    Output: Raw NOTAM records                  │
└─────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────┐
│ 2. Fetch Geometry Data                       │
│    Source: EAIP-HTML (enr5.html)              │
│    Output: Raw geometry data                  │
└─────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────┐
│ 3. Parse NOTAM Data                           │
│    • Extract NOTAM ID, summary, text          │
│    • Parse validity periods                   │
│    • Extract altitude information             │
│    • Normalize data structure                 │
└─────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────┐
│ 4. Parse Geometry Data                        │
│    • Extract coordinates from HTML            │
│    • Convert to GeoJSON format                 │
│    • Validate geometry structure               │
│    • Handle missing/partial data              │
└─────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────┐
│ 5. Combine Data Sources                      │
│    • Match NOTAM records with geometry        │
│    • Handle cases where geometry is missing   │
│    • Create unified data structure            │
│    • Preserve raw data for debugging          │
└─────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────┐
│ 6. Generate Unified JSON Output               │
│    • Apply schema version                     │
│    • Add timestamps                           │
│    • Include source metadata                  │
│    • Format according to specification        │
└─────────────────────────────────────────────┘
```

## Unified JSON Format Specification

```typescript
interface UnifiedJsonOutput {
    schemaVersion: string;              // "1.0"
    generatedAtUtc: string;             // ISO 8601 timestamp
    sources: {
        notam: {
            provider: string;         // "EANS"
            dataset: string;           // "area24"
            url: string;               // Source URL
        };
        geometry: {
            provider: string;         // "EAIP-HTML"
            dataset: string;           // "enr5"
            url: string;               // Source URL
        };
    };
    items: UnifiedItem[];
}

interface UnifiedItem {
    id: string;                        // NOTAM ID (e.g., "A1234/25")
    summary: string;                   // Short description
    text: string;                      // Full NOTAM text
    validFromUtc: string;              // ISO 8601 timestamp
    validToUtc: string;                // ISO 8601 timestamp
    eventTimeUtc: string;              // ISO 8601 timestamp
    
    altitudes: AltitudeInfo[];         // Parsed altitude data
    
    geometry: GeoJSONGeometry | null; // Combined geometry or null
    geometrySource: string;            // "geojson" or "notamText"
    geometryParseReason: string | null; // Reason if geometry missing
    geometrySourceDetails: {
        source: string;                // "eaip"
        sourceUrl: string;             // Source URL
        effectiveDate: string;         // Effective date
        parserVersion: string;         // Parser version
        issues: string[];              // Parsing issues
    };
    
    raw: {
        notam: {
            provider: string;
            payload: any;               // Original NOTAM object
        };
        geometry: {
            provider: string;
            payload: any;               // Original geometry object
        };
    };
}

interface AltitudeInfo {
    meters: number;                   // Altitude in meters
    ref: string;                      // Reference (AGL, MSL, etc.)
    source: string;                   // "reported" or "calculated"
    comment: string;                  // Human-readable description
    rawText: string;                  // Original text from NOTAM
}
```

## Component Design

### 1. NOTAM Fetcher (`notamFetcher.ts`)

**Responsibilities:**
- Fetch NOTAM data from EANS API endpoint
- Handle authentication and error cases
- Parse raw JSON response
- Normalize data structure

**Interface:**
```typescript
interface NotamFetcher {
    fetchNotamData(url: string): Promise<NotamData[]>;
    parseNotamResponse(response: any): NotamData[];
    normalizeNotamData(rawData: any): NotamData;
}
```

### 2. Geometry Fetcher (`geometryFetcher.ts`)

**Responsibilities:**
- Fetch geometry data from EAIP-HTML source
- Parse HTML content to extract coordinates
- Convert to standardized GeoJSON format
- Handle various HTML table formats

**Interface:**
```typescript
interface GeometryFetcher {
    fetchGeometryData(url: string): Promise<GeometryData[]>;
    parseHtmlGeometry(html: string): GeometryData[];
    convertToGeoJson(rawData: any): GeoJSONFeature;
}
```

### 3. Data Combiner (`dataCombiner.ts`)

**Responsibilities:**
- Match NOTAM records with corresponding geometry
- Handle cases where geometry is missing
- Create unified data structure
- Preserve raw data for debugging

**Interface:**
```typescript
interface DataCombiner {
    combineData(notamData: NotamData[], geometryData: GeometryData[]): UnifiedItem[];
    findMatchingGeometry(notam: NotamData, geometries: GeometryData[]): GeometryData | null;
    createUnifiedItem(notam: NotamData, geometry: GeometryData | null): UnifiedItem;
}
```

### 4. Altitude Parser (`altitudeParser.ts`)

**Responsibilities:**
- Parse altitude information from NOTAM text
- Convert between different altitude units (FT, M, FL)
- Handle various altitude formats (SFC, AGL, MSL, AMSL)
- Validate altitude ranges

**Interface:**
```typescript
interface AltitudeParser {
    parseAltitudes(notamText: string): AltitudeInfo[];
    convertAltitude(value: string, unit: string): number;
    validateAltitudeRange(lower: number, upper: number): boolean;
}
```

### 5. Main Integration (`index.ts`)

**Responsibilities:**
- Orchestrate the entire data processing pipeline
- Handle error cases gracefully
- Generate final unified JSON output
- Provide main API interface

**Interface:**
```typescript
interface GeoJsonSystem {
    generateUnifiedData(): Promise<UnifiedJsonOutput>;
    setNotamSource(url: string): void;
    setGeometrySource(url: string): void;
    getSystemStatus(): SystemStatus;
}
```

## Error Handling Strategy

### NOTAM Data Errors
- **Network failure**: Retry with exponential backoff
- **Invalid data format**: Log error and skip record
- **Missing required fields**: Use defaults where possible

### Geometry Data Errors
- **Missing geometry**: Set `geometry: null` and `geometryParseReason: "NO_COORDS"`
- **Invalid coordinates**: Log error and skip geometry
- **Format mismatch**: Attempt alternative parsing methods

### System Errors
- **Critical failures**: Throw exception with detailed context
- **Recoverable errors**: Continue processing with partial data
- **Validation errors**: Collect in `geometrySourceDetails.issues` array

## Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock external API responses
- Test edge cases and error conditions

### Integration Tests
- Test complete data pipeline
- Verify data combination logic
- Test with real API responses

### End-to-End Tests
- Test full system with live data
- Verify output format compliance
- Performance testing

## Performance Considerations

- **Caching**: Implement caching for API responses
- **Parallel processing**: Fetch NOTAM and geometry data concurrently
- **Memory management**: Stream large responses when possible
- **Batch processing**: Process data in chunks for large datasets

## Future Enhancements

- Support for additional data sources
- Advanced geometry validation
- Machine learning for NOTAM text parsing
- Real-time data updates via WebSockets
- Historical data archiving and retrieval