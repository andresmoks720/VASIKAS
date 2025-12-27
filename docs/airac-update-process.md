# AIRAC Update Process Documentation

## Overview
The AIRAC (Aeronautical Information Regulation and Control) update process automates the retrieval and processing of new eAIP data when effective dates change. This ensures the application always has the most current airspace information.

## Update Schedule

### Standard AIRAC Cycle
- **Frequency**: Every 28 days
- **Effective Day**: Typically Thursday
- **Publication**: 2 days before effective date
- **Data Availability**: Effective date + 1 day on eAIP website

### Update Timeline
```
Day -2: Data published to eAIP system
Day -1: Data available on eAIP website  
Day 0: AIRAC cycle effective date
Day +1: Data scraped and processed by our system
```

## Automated Update Process

### Discovery Phase
1. **Fetch History Page**: `https://eaip.eans.ee/history-en-GB.html`
2. **Extract Effective Date**: Parse "Currently Effective Issue" date (e.g. "25 DEC 2025")
3. **Compare with Current**: Check against stored effective date
4. **Trigger Update**: If different, initiate download process

### Download Phase
1. **Construct URL**: `https://eaip.eans.ee/<YYYY-MM-DD>/html/eAIP/EE-ENR-5.1-en-GB.html`
2. **Fetch HTML**: Download eAIP ENR 5.1 page
3. **Calculate Checksum**: Generate SHA256 of raw HTML
4. **Cache Raw Data**: Store in `data/cache/eaip/<date>/EE-ENR-5.1.html`

### Processing Phase
1. **Parse HTML**: Extract airspace designators and coordinate chains
2. **Convert Coordinates**: DDMMSS format to decimal degrees
3. **Validate Geometry**: Check ring closure, point count, coordinate ranges
4. **Generate GeoJSON**: Create FeatureCollection with proper structure
5. **Store Output**: Save to `data/airspace/ee/<effectiveDate>/enr5_1.geojson`

### Indexing Phase
1. **Update Latest**: Update `data/airspace/ee/latest.json` metadata
2. **Build Index**: Create Map<designator, Feature> for runtime lookup
3. **Validate Consistency**: Cross-check with previous versions
4. **Generate Report**: Log statistics and issues

## Manual Update Process

### Trigger Update
```bash
npm run eaip:pull
```

### Override Date
```bash
npm run eaip:pull --date=2025-10-30
```

## Monitoring and Alerting

### Health Checks
- **Data Availability**: Verify eAIP website accessibility
- **Parsing Success Rate**: Monitor successful vs failed parses
- **Geometry Validity**: Track validation pass/fail rates
- **File Integrity**: Verify checksums and file completeness

### Alert Thresholds
- **Critical**: Data fetch failure, parsing error rate > 50%
- **Warning**: Validation failure rate > 10%, new designators detected
- **Info**: New effective date, processing statistics

### Dashboard Metrics
- **Current Effective Date**: Display active data version
- **Feature Count**: Number of parsed airspace areas
- **Issue Count**: Number of geometry issues detected
- **Success Rate**: Percentage of successful parses

## Rollback Strategy

### Automatic Rollback
- **Trigger**: If new data fails validation checks
- **Action**: Revert to previous valid dataset
- **Notification**: Alert operators of rollback

### Manual Rollback
- **Procedure**: Restore from backup files in `data/airspace/ee/backup/`
- **Verification**: Validate restored data before activation
- **Notification**: Log rollback event with details

## Data Consistency

### Versioning
- **Directory Structure**: `data/airspace/ee/<effectiveDate>/`
- **File Naming**: Consistent naming convention for traceability
- **Metadata**: Include effective date, source URL, checksum in all outputs

### Backup Policy
- **Automatic**: Backup previous version before each update
- **Retention**: Keep last 5 versions for recovery
- **Verification**: Check backup integrity after creation

## Error Recovery

### Common Failures
- **Network Issues**: Retry with exponential backoff
- **Parsing Errors**: Log specific failures, continue with valid data
- **Validation Issues**: Flag problematic areas, maintain partial functionality

### Recovery Procedures
1. **Identify Root Cause**: Analyze error logs and patterns
2. **Apply Fix**: Update parser or validation rules as needed
3. **Reprocess**: Re-run with corrected logic
4. **Verify**: Confirm fix resolves the issue

## Operational Procedures

### Pre-Update Checklist
- [ ] Verify current system stability
- [ ] Check eAIP website accessibility
- [ ] Ensure sufficient disk space
- [ ] Notify stakeholders of scheduled update

### Post-Update Verification
- [ ] Confirm new effective date is active
- [ ] Validate geometry rendering on map
- [ ] Check NOTAM integration functionality
- [ ] Verify unvisualizable NOTAM display

### Emergency Procedures
- **Data Unavailable**: Switch to cached data with warning
- **Parsing Failure**: Use previous valid data with alert
- **Validation Error**: Flag affected areas with reduced functionality

## Quality Assurance

### Data Validation
- **Completeness**: All expected designators present
- **Accuracy**: Coordinates in valid Estonian range
- **Consistency**: No overlaps or gaps in coverage
- **Timeliness**: Data reflects current effective date

### Testing Protocol
- **Automated Tests**: Run validation pipeline on new data
- **Manual Verification**: Spot-check critical areas
- **Comparison**: Diff with previous version to detect changes
- **Performance**: Verify rendering speed with new data

## Integration Points

### Frontend Integration
- **Data Loading**: Automatically refresh when new data available
- **Visual Indicators**: Show update status to users
- **Fallback Handling**: Gracefully degrade if update fails

### Backend Integration
- **API Endpoints**: Update data endpoints with new version
- **Caching**: Invalidate old caches when new data arrives
- **Notifications**: Alert dependent services of updates