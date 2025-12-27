# Coordinate Parsing Logic Documentation

## Special Parsing for Estonian eAIP Documents

The coordinate parsing system has special handling for complex coordinate chains found in Estonian eAIP documents, particularly in airspace definitions like EER1 PIIRIALA, EED38, etc.

### Complex Coordinate Chains

Some airspace definitions in Estonian eAIP documents contain both coordinate chains and descriptive text in Estonian, such as:

```
573311N 0271110E -
edasi piki riigipiiri kuni punktini
573104N 0272102E -
edasi mööda Eesti Vabariigi ja Vene Föderatsiooni vahelist kontrolljoont punktini
592818N 0280236E -
```

### Parsing Logic

The `parseCoordinateChain` function in `src/services/notam/geometry/coordParsers.ts` handles these complex chains by:

1. Splitting the text by " - " to get individual segments
2. Checking each segment to determine if it's coordinates or descriptive text
3. Using `containsDescriptiveText()` to identify Estonian descriptive phrases
4. Using `mightBeDescriptiveText()` as a fallback to identify non-coordinate segments
5. Only parsing segments that match coordinate patterns (DDMMSSN DDDMMSSEx format)

### Important Notes

- This parsing logic is **specifically for the HTML parsing workflow** from eAIP documents
- When transitioning to pure GeoJSON data sources, this complex parsing logic may not be needed
- The logic must be preserved for now as it handles complex airspace definitions from Estonian eAIP documents
- The same parsing functions are used by both offline tools and runtime to prevent drift

### File Locations

- Main parsing logic: `src/services/notam/geometry/coordParsers.ts`
- Tests: `src/services/notam/geometry/coordParsers.test.ts`
- Used by: 
  - Offline HTML parser: `tools/eaip-import/src/parser.ts`
  - Runtime NOTAM processing: `src/services/notam/geometry/geometryParsers.ts`

### Future Considerations

When the system transitions to using pure GeoJSON data sources instead of parsing HTML eAIP documents, this complex parsing logic with descriptive text handling may become obsolete and could be simplified to only handle clean coordinate chains.