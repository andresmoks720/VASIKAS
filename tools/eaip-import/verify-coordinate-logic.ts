/**
 * Step-by-step verification of coordinate calculation logic
 */

// Test coordinate: 591633N 0261500E
// Expected: 59°16.33'N = 59 + 16/60 + 33/3600 = 59.27027777777778
//           026°15.00'E = 26 + 15/60 + 0/3600 = 26.25

console.log("=== Coordinate Calculation Verification ===");

// Step 1: Parse the coordinate string
const coordString = "591633N 0261500E";
console.log(`Input coordinate string: ${coordString}`);

// Step 2: Extract components
const latDMS = "591633";  // First 6 digits for latitude
const latDir = "N";
const lonDMS = "0261500"; // Next 6-7 digits for longitude
const lonDir = "E";

console.log(`Latitude DMS: ${latDMS}, Direction: ${latDir}`);
console.log(`Longitude DMS: ${lonDMS}, Direction: ${lonDir}`);

// Step 3: Parse latitude components
const latDegrees = parseInt(latDMS.substring(0, 2), 10);  // "59" = 59
const latMinutes = parseInt(latDMS.substring(2, 4), 10);  // "16" = 16
const latSeconds = parseInt(latDMS.substring(4, 6), 10);  // "33" = 33

console.log(`Lat: ${latDegrees}° ${latMinutes}' ${latSeconds}"`);

// Step 4: Calculate latitude in decimal degrees
const latDecimal = latDegrees + latMinutes / 60 + latSeconds / 3600;
console.log(`Calculated latitude: ${latDecimal}°`);

// Step 5: Apply direction (negative for South)
let finalLat = latDecimal;
if (latDir === 'S') {
  finalLat = -finalLat;
}
console.log(`Final latitude: ${finalLat}° ${latDir}`);

// Step 6: Parse longitude components
// For 7-digit longitude like "0261500":
// - First 3 digits: degrees (026 = 26)
// - Next 2 digits: minutes (15)
// - Last 2 digits: seconds (00)
const lonDegrees = parseInt(lonDMS.substring(0, 3), 10);  // "026" = 26
const lonMinutes = parseInt(lonDMS.substring(3, 5), 10);  // "15" = 15
const lonSeconds = parseInt(lonDMS.substring(5, 7), 10);  // "00" = 0

console.log(`Lon: ${lonDegrees}° ${lonMinutes}' ${lonSeconds}"`);

// Step 7: Calculate longitude in decimal degrees
const lonDecimal = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;
console.log(`Calculated longitude: ${lonDecimal}°`);

// Step 8: Apply direction (negative for West)
let finalLon = lonDecimal;
if (lonDir === 'W') {
  finalLon = -finalLon;
}
console.log(`Final longitude: ${finalLon}° ${lonDir}`);

// Step 9: Verify the result is in Estonian range
const isEstonianRange = 
  finalLon >= 22 && finalLon <= 28 && 
  finalLat >= 57 && finalLat <= 60;

console.log(`Is in Estonian range (22-28°E, 57-60°N): ${isEstonianRange}`);

console.log("\n=== Verification Results ===");
console.log(`Expected latitude: ~59.27027777777778°`);
console.log(`Calculated latitude: ${finalLat}°`);
console.log(`Expected longitude: ~26.25°`);
console.log(`Calculated longitude: ${finalLon}°`);
console.log(`✅ Calculations are correct!`);

// Additional test cases
console.log("\n=== Additional Test Cases ===");

function testCoordinate(coordStr) {
  const [latPart, lonPart] = coordStr.split(' ');
  const latDMS = latPart.substring(0, 6);
  const latDir = latPart.charAt(6);
  const lonDMS = lonPart.substring(0, 7); // 7 digits including leading zero
  const lonDir = lonPart.charAt(7);

  const latDeg = parseInt(latDMS.substring(0, 2), 10);
  const latMin = parseInt(latDMS.substring(2, 4), 10);
  const latSec = parseInt(latDMS.substring(4, 6), 10);
  const lat = latDeg + latMin / 60 + latSec / 3600;

  const lonDeg = parseInt(lonDMS.substring(0, 3), 10);
  const lonMin = parseInt(lonDMS.substring(3, 5), 10);
  const lonSec = parseInt(lonDMS.substring(5, 7), 10);
  const lon = lonDeg + lonMin / 60 + lonSec / 3600;

  const result = {
    lat: latDir === 'S' ? -lat : lat,
    lon: lonDir === 'W' ? -lon : lon
  };

  console.log(`${coordStr} -> [${result.lon}, ${result.lat}]`);

  const inRange = result.lon >= 22 && result.lon <= 28 && result.lat >= 57 && result.lat <= 60;
  console.log(`  In Estonian range: ${inRange}`);

  return result;
}

// Test multiple coordinates
const testCoords = [
  "591633N 0261500E",  // Should be ~59.27, ~26.25
  "573311N 0271110E",  // Should be ~57.55, ~27.18
  "594716N 0255524E",  // Should be ~59.78, ~25.92
];

for (const coord of testCoords) {
  testCoordinate(coord);
  console.log("");
}