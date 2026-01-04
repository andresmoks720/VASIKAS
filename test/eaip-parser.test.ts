import { describe, it, expect, vi } from 'vitest';
import { parseEaipEnr51, generateGeoJson } from '../tools/eaip-import/src/parser';

// Mock fetch globally
vi.mock('node-fetch', () => ({
  default: vi.fn()
}));

// Sample HTML content for testing
const sampleEaipHtml = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html>
<head>
  <meta name="EM.effectiveDateStart" content="2025-10-30"/>
  <meta name="DC.date" content="2025-10-30"/>
</head>
<body>
  <div id="ENR-5.1">
    <div>
      <h4>Restricted Areas</h4>
      <table>
        <tbody>
          <tr>
            <td>
              <p><strong>EER15D</strong></p>
              591633N 0261500E - 591639N 0255647E - 591614N 0254748E
            </td>
            <td>FL95<br/>SFC</td>
            <td>Military air operations</td>
          </tr>
          <tr>
            <td>
              <p><strong>EER15E</strong></p>
              591617N 0265703E - 591633N 0261500E - 594421N 0261500E
            </td>
            <td>FL95<br/>SFC</td>
            <td>Military air operations</td>
          </tr>
          <tr>
            <td>
              <p><strong>EER_UNSUPPORTED</strong></p>
              further along the state border to the point
            </td>
            <td>FL95<br/>SFC</td>
            <td>Complex geometry</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
`;

describe('eAIP Parser', () => {
  const testUrl = 'https://eaip.eans.ee/2025-10-30/html/eAIP/EE-ENR-5.1-en-GB.html';

  it('should parse basic designators and coordinates', async () => {
    const result = await parseEaipEnr51(sampleEaipHtml, testUrl);

    expect(result.effectiveDate).toBe('2025-10-30');
    expect(result.sourceUrl).toBe(testUrl);
    expect(result.features.length).toBeGreaterThan(0);

    // Check that we have features with designators
    const eer15dFeature = result.features.find(f => f.properties.designator === 'EER15D');
    expect(eer15dFeature).toBeDefined();
    expect(eer15dFeature?.properties.designator).toBe('EER15D');
    expect(eer15dFeature?.properties.upperLimit).toContain('FL95');
  });

  it('should validate geometry and detect issues', async () => {
    const result = await parseEaipEnr51(sampleEaipHtml, testUrl);

    // Should have issues for unsupported geometry
    expect(result.issues.some(issue => issue.includes('AIP_PARSE_UNSUPPORTED'))).toBe(true);
  });

  it('should generate valid GeoJSON', async () => {
    const result = await parseEaipEnr51(sampleEaipHtml, testUrl);
    const geoJson = generateGeoJson(result);

    const parsed = JSON.parse(geoJson);
    expect(parsed.type).toBe('FeatureCollection');
    expect(Array.isArray(parsed.features)).toBe(true);
    expect(parsed.metadata).toBeDefined();
    expect(parsed.metadata.effectiveDate).toBe('2025-10-30');
  });

  it('should handle coordinate conversion correctly', async () => {
    const result = await parseEaipEnr51(sampleEaipHtml, testUrl);

    // Find a feature with coordinates
    const featureWithCoords = result.features.find(f =>
      f.geometry.coordinates &&
      f.geometry.coordinates[0] &&
      f.geometry.coordinates[0].length > 0
    );

    if (featureWithCoords) {
      const coords = featureWithCoords.geometry.coordinates[0];
      // Coordinates should be in [lon, lat] format
      for (const coord of coords) {
        expect(coord.length).toBe(2);
        const [lon, lat] = coord;
        expect(typeof lon).toBe('number');
        expect(typeof lat).toBe('number');
        // Basic sanity check for Estonian coordinates
        expect(lon).toBeGreaterThanOrEqual(22);
        expect(lon).toBeLessThanOrEqual(28);
        expect(lat).toBeGreaterThanOrEqual(57);
        expect(lat).toBeLessThanOrEqual(60);
      }
    }
  });

  it('should report parse errors for invalid geometry', async () => {
    // Create HTML with invalid geometry (too few points)
    const invalidHtml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="EM.effectiveDateStart" content="2025-10-30"/>
    </head>
    <body>
      <div id="ENR-5.1">
        <div>
          <h4>Restricted Areas</h4>
          <table>
            <tbody>
              <tr>
                <td>
                  <p><strong>EER_INVALID</strong></p>
                  591633N 0261500E
                </td>
                <td>FL95<br/>SFC</td>
                <td>Too few points</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    const result = await parseEaipEnr51(invalidHtml, testUrl);

    // Should have issues for invalid geometry (too few points)
    expect(result.issues.some(issue =>
      issue.includes('AIP_PARSE_ERROR') ||
      issue.includes('Failed to parse coordinates')
    )).toBe(true);
  });

  it('should maintain ring closure', async () => {
    const result = await parseEaipEnr51(sampleEaipHtml, testUrl);

    for (const feature of result.features) {
      const coords = feature.geometry.coordinates[0];
      if (coords.length >= 4) { // Need at least 4 points for a closed polygon
        const firstPoint = coords[0];
        const lastPoint = coords[coords.length - 1];

        // Check if ring is closed (first and last points are the same)
        const tolerance = 0.000001;
        const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
          Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;
        expect(isClosed).toBe(true);
      }
    }
  });

  it('should generate deterministic outputs', async () => {
    const result1 = await parseEaipEnr51(sampleEaipHtml, testUrl);
    const result2 = await parseEaipEnr51(sampleEaipHtml, testUrl);

    // Same input should produce same effective date and other metadata
    expect(result1.effectiveDate).toBe(result2.effectiveDate);
    expect(result1.sourceUrl).toBe(result2.sourceUrl);

    // SHA256 should be the same for same HTML
    expect(result1.sha256).toBe(result2.sha256);
  });
});

describe('Coordinate Parsing', () => {
  const testUrl = 'https://eaip.eans.ee/2025-10-30/html/eAIP/EE-ENR-5.1-en-GB.html';

  it('should correctly parse DDMMSS format', () => {
    // This test verifies the coordinate parsing function
    // Since the function is internal, we test through the full parser
    const testHtml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="EM.effectiveDateStart" content="2025-10-30"/>
    </head>
    <body>
      <div id="ENR-5.1">
        <div>
          <h4>Test Area</h4>
          <table>
            <tbody>
              <tr>
                <td>
                  <p><strong>TEST01</strong></p>
                  591633N 0261500E - 591639N 0255647E - 591614N 0254748E
                </td>
                <td>FL95<br/>SFC</td>
                <td>Test coordinates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
    `;

    return parseEaipEnr51(testHtml, testUrl).then(result => {
      const testFeature = result.features.find(f => f.properties.designator === 'TEST01');
      expect(testFeature).toBeDefined();

      if (testFeature) {
        const coords = testFeature.geometry.coordinates[0];
        expect(coords.length).toBeGreaterThanOrEqual(4);

        // The first coordinate should be approximately 26.25, 59.275 (from 0261500E, 591633N)
        // Note: The actual values depend on the correctness of the coordinate parsing
        const [firstLon, firstLat] = coords[0];
        expect(typeof firstLon).toBe('number');
        expect(typeof firstLat).toBe('number');
        expect(firstLon).toBeCloseTo(26.25, 5);
        expect(firstLat).toBeCloseTo(59.275833, 5);
      }
    });
  });
});
