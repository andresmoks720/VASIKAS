import { parseCoordinate } from '../src/parser';

// Unit tests for coordinate parsing
console.log('=== Unit Tests for Coordinate Parsing ===\n');

// Test 1: Single coordinate pair
console.log('Test 1: Single coordinate pair');
const coord1 = '591633N 0261500E';
const result1 = parseCoordinate(coord1);
console.log(`Input: ${coord1}`);
console.log(`Output: ${JSON.stringify(result1)}`);
if (result1) {
  console.log(`Expected: { lat: ~59.2758, lon: ~26.25 }`);
  const latOk = Math.abs(result1.lat - 59.27583333333333) < 0.001;
  const lonOk = Math.abs(result1.lon - 26.25) < 0.001;
  console.log(`✅ Passed: ${latOk && lonOk}`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 2: Another coordinate pair
console.log('Test 2: Another coordinate pair');
const coord2 = '573311N 0271110E';
const result2 = parseCoordinate(coord2);
console.log(`Input: ${coord2}`);
console.log(`Output: ${JSON.stringify(result2)}`);
if (result2) {
  console.log(`Expected: { lat: ~57.5530, lon: ~27.1861 }`);
  const latOk = Math.abs(result2.lat - 57.55305555555555) < 0.001;
  const lonOk = Math.abs(result2.lon - 27.18611111111111) < 0.001;
  console.log(`✅ Passed: ${latOk && lonOk}`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 3: Coordinate with West direction
console.log('Test 3: Coordinate with West direction');
const coord3 = '584514N 0243658W';
const result3 = parseCoordinate(coord3);
console.log(`Input: ${coord3}`);
console.log(`Output: ${JSON.stringify(result3)}`);
if (result3) {
  console.log(`Expected: { lat: ~58.7538, lon: ~-24.6161 } (negative longitude)`);
  const latOk = Math.abs(result3.lat - 58.75388888888889) < 0.001;
  const lonOk = Math.abs(result3.lon - (-24.61611111111111)) < 0.001;
  console.log(`✅ Passed: ${latOk && lonOk}`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 4: Coordinate with South direction
console.log('Test 4: Coordinate with South direction');
const coord4 = '551633S 0261500E';
const result4 = parseCoordinate(coord4);
console.log(`Input: ${coord4}`);
console.log(`Output: ${JSON.stringify(result4)}`);
if (result4) {
  console.log(`Expected: { lat: ~-55.2758, lon: ~26.25 } (negative latitude)`);
  const latOk = Math.abs(result4.lat - (-55.27583333333333)) < 0.001;
  const lonOk = Math.abs(result4.lon - 26.25) < 0.001;
  console.log(`✅ Passed: ${latOk && lonOk}`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 5: Invalid coordinate format
console.log('Test 5: Invalid coordinate format');
const coord5 = 'invalid coordinate';
const result5 = parseCoordinate(coord5);
console.log(`Input: ${coord5}`);
console.log(`Output: ${JSON.stringify(result5)}`);
console.log(`Expected: null`);
console.log(`✅ Passed: ${result5 === null}`);
console.log('');

// Test 6: Coordinate chain parsing
console.log('Test 6: Coordinate chain parsing');
const chain = '591633N 0261500E - 591639N 0255647E - 591614N 0254748E';
const chainResult = parseCoordinateChain(chain);
console.log(`Input: ${chain}`);
console.log(`Output: ${JSON.stringify(chainResult)}`);
console.log(`Expected: Array with 3 coordinate objects`);
console.log(`✅ Passed: ${Array.isArray(chainResult) && chainResult.length === 3}`);
console.log('');

// Test 7: Chain with invalid coordinate
console.log('Test 7: Chain with invalid coordinate');
const chain2 = '591633N 0261500E - invalid - 591614N 0254748E';
const chainResult2 = parseCoordinateChain(chain2);
console.log(`Input: ${chain2}`);
console.log(`Output: ${JSON.stringify(chainResult2)}`);
console.log(`Expected: null (because of invalid coordinate in chain)`);
console.log(`✅ Passed: ${chainResult2 === null}`);
console.log('');

// Test 8: Boundary coordinates (Estonian range)
console.log('Test 8: Boundary coordinates');
const coordWest = '580000N 0220000E';  // Western edge of Estonia
const coordEast = '580000N 0280000E';  // Eastern edge of Estonia
const coordNorth = '590000N 0250000E'; // Northern edge of Estonia
const coordSouth = '570000N 0250000E'; // Southern edge of Estonia

const resultWest = parseCoordinate(coordWest);
const resultEast = parseCoordinate(coordEast);
const resultNorth = parseCoordinate(coordNorth);
const resultSouth = parseCoordinate(coordSouth);

console.log(`West edge (22°E): ${resultWest ? resultWest.lon : null}`);
console.log(`East edge (28°E): ${resultEast ? resultEast.lon : null}`);
console.log(`North edge (59°N): ${resultNorth ? resultNorth.lat : null}`);
console.log(`South edge (57°N): ${resultSouth ? resultSouth.lat : null}`);

const westOk = resultWest !== null && Math.abs(resultWest.lon - 22.0) < 0.001;
const eastOk = resultEast !== null && Math.abs(resultEast.lon - 28.0) < 0.001;
const northOk = resultNorth !== null && Math.abs(resultNorth.lat - 59.0) < 0.001;
const southOk = resultSouth !== null && Math.abs(resultSouth.lat - 57.0) < 0.001;

console.log(`✅ West boundary test: ${westOk}`);
console.log(`✅ East boundary test: ${eastOk}`);
console.log(`✅ North boundary test: ${northOk}`);
console.log(`✅ South boundary test: ${southOk}`);

console.log('\n=== All unit tests completed ===');
