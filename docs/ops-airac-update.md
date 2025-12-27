# AIRAC Update Process

## Overview
This document describes the AIRAC (Aeronautical Information Regulation and Control) cycle update process for eAIP data and operational procedures.

## AIRAC Cycle

### Schedule
- **Cycle Length**: 28-day cycle
- **Effective Dates**: Typically on Thursdays
- **Publication**: 2 days before effective date
- **Data Availability**: Effective date + 1 day on eAIP website

### Update Timeline
```
Day -2: Data published to eAIP system
Day -1: Data available on eAIP website  
Day 0: AIRAC cycle effective date
Day +1: Data scraped and processed by our system
```

## Update Process

### Automated Update
1. **Check for Updates**: Daily check of https://eaip.eans.ee/history-en-GB.html
2. **Extract Effective Date**: Parse "Currently Effective Issue" date
3. **Download Data**: Fetch ENR 5.1 page for new effective date
4. **Parse Geometry**: Extract airspace polygons and coordinates
5. **Validate Data**: Run geometry validation checks
6. **Update Files**: Replace data files with new version
7. **Notify Systems**: Update latest.json with new effective date

### Manual Update
- **Trigger**: When automated process fails or manual intervention needed
- **Process**: Run `pnpm eaip:pull` command
- **Verification**: Manual review of new data before deployment

## Monitoring

### Health Checks
- **Data Availability**: Verify eAIP website is accessible
- **Parsing Success**: Monitor parser success rate
- **Geometry Validity**: Check for invalid coordinate ranges
- **File Integrity**: Verify SHA256 checksums

### Alerting
- **Critical**: Data download failure, parsing errors, invalid geometry
- **Warning**: New designators, unexpected coordinate ranges
- **Info**: Successful updates, new effective dates

### Dashboard
- **Status**: Current effective date and update status
- **Metrics**: Parsing success rate, geometry validation results
- **History**: Previous update timestamps and results

## Rollback Strategy

### Automatic Rollback
- **Trigger**: If new data fails validation
- **Action**: Revert to previous valid data
- **Notification**: Alert operators of rollback

### Manual Rollback
- **Process**: Restore from backup data files
- **Command**: `pnpm eaip:restore <date>`
- **Verification**: Confirm restored data is valid

## Operational Procedures

### Pre-Update
1. Verify current data is stable
2. Check eAIP website accessibility
3. Ensure monitoring systems are operational

### During Update
1. Monitor parsing process
2. Validate geometry results
3. Check for unexpected changes

### Post-Update
1. Verify data integrity
2. Update monitoring baselines
3. Document any changes or issues

## Emergency Procedures

### Data Unavailability
- **Action**: Use cached data until next cycle
- **Duration**: Maximum 28 days before data becomes stale
- **Notification**: Alert team of extended outage

### Parsing Failure
- **Action**: Switch to manual update process
- **Fallback**: Use previous valid data
- **Resolution**: Fix parser and re-run

### Invalid Geometry
- **Action**: Flag affected areas
- **Fallback**: Use simplified geometry or circle approximations
- **Resolution**: Manual verification and correction