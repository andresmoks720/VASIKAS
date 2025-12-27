import { fetchAndParseEaipEnr51, generateGeoJson } from './parser';
import * as fs from 'fs';
import * as path from 'path';

async function testParser() {
  try {
    console.log('Testing eAIP parser...');
    
    // Test with the provided URL
    const url = 'https://eaip.eans.ee/2025-10-30/html/eAIP/EE-ENR-5.1-en-GB.html';
    
    console.log(`Fetching and parsing: ${url}`);
    const result = await fetchAndParseEaipEnr51(url);
    
    console.log(`\nParse completed!`);
    console.log(`Effective Date: ${result.effectiveDate}`);
    console.log(`SHA256: ${result.sha256}`);
    console.log(`Generated At: ${result.generatedAt}`);
    console.log(`Features found: ${result.features.length}`);
    console.log(`Issues: ${result.issues.length}`);
    
    if (result.issues.length > 0) {
      console.log('\nIssues found:');
      result.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    if (result.features.length > 0) {
      console.log('\nFirst few features:');
      for (let i = 0; i < Math.min(3, result.features.length); i++) {
        const feature = result.features[i];
        console.log(`  Designator: ${feature.properties.designator}`);
        console.log(`  Coordinates: ${feature.geometry.coordinates[0].length} points`);
        console.log(`  Upper Limit: ${feature.properties.upperLimit}`);
        console.log(`  Lower Limit: ${feature.properties.lowerLimit}`);
        console.log('  ---');
      }
    }
    
    // Generate GeoJSON
    const geoJson = generateGeoJson(result);
    
    // Create output directories if they don't exist
    const outputDir = path.join(process.cwd(), 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write GeoJSON to file
    const geoJsonPath = path.join(outputDir, 'enr5_1.geojson');
    fs.writeFileSync(geoJsonPath, geoJson);
    console.log(`\nGeoJSON saved to: ${geoJsonPath}`);
    
    // Write metadata to file
    const metadataPath = path.join(outputDir, 'latest.json');
    fs.writeFileSync(metadataPath, JSON.stringify({
      effectiveDate: result.effectiveDate,
      sourceUrl: result.sourceUrl,
      generatedAt: result.generatedAt,
      sha256: result.sha256,
      featureCount: result.features.length,
      issueCount: result.issues.length
    }, null, 2));
    console.log(`Metadata saved to: ${metadataPath}`);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testParser();