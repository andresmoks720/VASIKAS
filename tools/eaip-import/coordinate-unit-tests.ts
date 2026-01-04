import { parseEaipCoordinateChain } from '../../src/services/notam/notamInterpreter';

// Unit tests for coordinate parsing
console.log('=== Unit Tests for eAIP Coordinate Parsing ===\n');

// Test 1: Single coordinate pair
console.log('Test 1: Single coordinate pair');
const coord1 = '591633N 0261500E';
const result1 = parseEaipCoordinateChain(coord1);
console.log(`Input: ${coord1}`);
console.log(`Output: ${JSON.stringify(result1)}`);
console.log(`Expected: Array with one coordinate [~26.25, ~59.2758]`);
if (result1 && result1.length > 0) {
  const [lon, lat] = result1[0];
  const latOk = Math.abs(lat - 59.27583333333333) < 0.001;
  const lonOk = Math.abs(lon - 26.25) < 0.001;
  console.log(`✅ Passed: ${latOk && lonOk} (lat: ${lat}, lon: ${lon})`);
} else {
  console.log('❌ Failed: Result is null or empty');
}
console.log('');

// Test 2: Coordinate chain with multiple points
console.log('Test 2: Coordinate chain with multiple points');
const chain2 = '591633N 0261500E - 591639N 0255647E - 591614N 0254748E';
const result2 = parseEaipCoordinateChain(chain2);
console.log(`Input: ${chain2}`);
console.log(`Output: ${JSON.stringify(result2)}`);
console.log(`Expected: Array with 3 coordinates`);
console.log(`✅ Passed: ${Array.isArray(result2) && result2.length === 3}\n`);

// Test 3: Another coordinate chain
console.log('Test 3: Another coordinate chain');
const chain3 = '573311N 0271110E - 573104N 0272102E';
const result3 = parseEaipCoordinateChain(chain3);
console.log(`Input: ${chain3}`);
console.log(`Output: ${JSON.stringify(result3)}`);
console.log(`Expected: Array with 2 coordinates in Estonian range`);
if (result3 && result3.length === 2) {
  const allInRange = result3.every(([lon, lat]) => 
    lon >= 22 && lon <= 28 && lat >= 57 && lat <= 60
  );
  console.log(`✅ Passed: ${allInRange}`);
} else {
  console.log('❌ Failed: Result is null or wrong length');
}
console.log('');

// Test 4: Coordinate with West direction
console.log('Test 4: Coordinate with West direction');
const coord4 = '584514N 0243658W';
const result4 = parseEaipCoordinateChain(coord4);
console.log(`Input: ${coord4}`);
console.log(`Output: ${JSON.stringify(result4)}`);
if (result4 && result4.length > 0) {
  const [lon] = result4[0];
  const isNegative = lon < 0;
  console.log(`✅ Passed: ${isNegative} (longitude is negative for West: ${lon})`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 5: Coordinate with South direction
console.log('Test 5: Coordinate with South direction');
const coord5 = '551633S 0261500E';
const result5 = parseEaipCoordinateChain(coord5);
console.log(`Input: ${coord5}`);
console.log(`Output: ${JSON.stringify(result5)}`);
if (result5 && result5.length > 0) {
  const [, lat] = result5[0];
  const isNegative = lat < 0;
  console.log(`✅ Passed: ${isNegative} (latitude is negative for South: ${lat})`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 6: Invalid coordinate format
console.log('Test 6: Invalid coordinate format');
const coord6 = 'invalid coordinate';
const result6 = parseEaipCoordinateChain(coord6);
console.log(`Input: ${coord6}`);
console.log(`Output: ${JSON.stringify(result6)}`);
console.log(`Expected: null`);
console.log(`✅ Passed: ${result6 === null}\n`);

// Test 7: Chain with invalid coordinate
console.log('Test 7: Chain with invalid coordinate');
const chain7 = '591633N 0261500E - invalid - 591614N 0254748E';
const result7 = parseEaipCoordinateChain(chain7);
console.log(`Input: ${chain7}`);
console.log(`Output: ${JSON.stringify(result7)}`);
console.log(`Expected: null (because of invalid coordinate in chain)`);
console.log(`✅ Passed: ${result7 === null}\n`);

// Test 8: Coordinate without spaces (single format)
console.log('Test 8: Coordinate without spaces');
const coord8 = '591633N0261500E';
const result8 = parseEaipCoordinateChain(coord8);
console.log(`Input: ${coord8}`);
console.log(`Output: ${JSON.stringify(result8)}`);
if (result8 && result8.length > 0) {
  const [lon, lat] = result8[0];
  const inRange = lon >= 22 && lon <= 28 && lat >= 57 && lat <= 60;
  console.log(`✅ Passed: ${inRange} (coordinate in range: [${lon}, ${lat}])`);
} else {
  console.log('❌ Failed: Result is null');
}
console.log('');

// Test 9: Chain with mixed formats (space and no-space)
console.log('Test 9: Chain with mixed formats');
const chain9 = '591633N 0261500E - 591639N0255647E';
const result9 = parseEaipCoordinateChain(chain9);
console.log(`Input: ${chain9}`);
console.log(`Output: ${JSON.stringify(result9)}`);
console.log(`Expected: Array with 2 coordinates`);
console.log(`✅ Passed: ${Array.isArray(result9) && result9.length === 2}\n`);

// Test 10: Boundary coordinates (Estonian range)
console.log('Test 10: Boundary coordinates');
const chain10 = '580000N 0220000E - 580000N 0280000E - 590000N 0250000E - 570000N 0250000E';
const result10 = parseEaipCoordinateChain(chain10);
console.log(`Input: ${chain10}`);
console.log(`Output: ${JSON.stringify(result10)}`);
if (result10 && result10.length === 4) {
  const allInRange = result10.every(([lon, lat]) => 
    lon >= 22 && lon <= 28 && lat >= 57 && lat <= 60
  );
  console.log(`✅ Passed: ${allInRange}`);
} else {
  console.log('❌ Failed: Result is null or wrong length');
}
console.log('');

console.log('=== All unit tests completed ===');
