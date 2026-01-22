import * as cheerio from 'cheerio';
import * as crypto from 'crypto-js';
import type { AnyNode } from 'domhandler';
import { parseEaipEnr51Core, ParserElement } from '../../../src/services/airspace/htmlParserCore';
import { AirspaceFeature } from '../../../src/services/airspace/airspaceTypes';

/**
 * Cheerio-based element wrapper for htmlParserCore
 */
class CheerioParserElement implements ParserElement {
  constructor(private $: cheerio.CheerioAPI, private element: cheerio.Cheerio<AnyNode>) { }

  querySelector(selector: string): ParserElement | null {
    const el = this.element.find(selector).first();
    return el.length > 0 ? new CheerioParserElement(this.$, el) : null;
  }

  querySelectorAll(selector: string): ParserElement[] {
    const elements = this.element.find(selector);
    return elements.get().map(el => new CheerioParserElement(this.$, this.$(el)));
  }

  getAttribute(name: string): string | null {
    return this.element.attr(name) || null;
  }

  get textContent(): string | null {
    return this.element.text();
  }

  get innerHTML(): string | null {
    return this.element.html() || null;
  }
}

// Define types for our data
interface ParseResult {
  features: AirspaceFeature[];
  issues: string[];
  effectiveDate: string;
  sourceUrl: string;
  sha256: string;
  generatedAt: string;
}

/**
 * Main parser function to extract airspace data from eAIP HTML
 * Uses the shared core logic for consistency with runtime
 */
export async function parseEaipEnr51(html: string, sourceUrl: string): Promise<ParseResult> {
  const $ = cheerio.load(html);
  const root = new CheerioParserElement($, $.root());

  // Calculate SHA256 of the HTML
  const sha256 = crypto.SHA256(html).toString();

  // Parse using shared core logic
  const { features, issues, effectiveDate } = parseEaipEnr51Core(root, sourceUrl);

  return {
    features,
    issues,
    effectiveDate: effectiveDate || '',
    sourceUrl,
    sha256,
    generatedAt: new Date().toISOString()
  };
}

export function resolveEnr5_1UrlFromIndexHtml(html: string, baseUrl: string): string {
  const $ = cheerio.load(html);
  const enrAnchor = $("#ENR-5");
  const scope = enrAnchor.length > 0 ? enrAnchor.parent() : $("body");
  const links = scope.find("a[href]").toArray();

  const scored = links
    .map((el) => {
      const href = $(el).attr("href")?.trim() ?? "";
      const text = $(el).text().trim();
      const haystack = `${href} ${text}`;
      let score = 0;

      if (/ENR\s*5\.1/i.test(haystack)) score += 3;
      if (/ENR[-\s]*5\.1/i.test(href)) score += 3;
      if (/ENR\s*5/i.test(haystack)) score += 1;

      return { href, score };
    })
    .filter((candidate) => candidate.href.length > 0 && candidate.score > 0)
    .sort((a, b) => b.score - a.score);

  const winner = scored[0]?.href;
  if (!winner) {
    throw new Error("Failed to locate ENR 5.1 link in eAIP index HTML.");
  }

  return new URL(winner, baseUrl).toString();
}

export async function fetchLatestEnr5_1Url(baseUrl: string = "https://eaip.eans.ee/"): Promise<string> {
  const response = await fetch(baseUrl, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Failed to fetch eAIP index: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const resolvedBase = response.url || baseUrl;
  return resolveEnr5_1UrlFromIndexHtml(html, resolvedBase);
}

/**
 * Validate geometry for a feature (preserved from original tooling)
 */
function validateGeometry(feature: AirspaceFeature, issues: string[]): AirspaceFeature {
  const geometry = feature.geometry;
  // Only validate Polygons for now (original logic assumption)
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    // If it's a single point or line string where we expect area, it's likely an error in this context
    issues.push(`INVALID_GEOMETRY: Feature ${feature.properties.designator} has invalid geometry type: ${geometry.type}`);
    return feature;
  }

  // Skip MultiPolygon validation for simplicity now, or iterate
  if (geometry.type === 'MultiPolygon') return feature;

  const coords = geometry.coordinates[0]; // Single outer ring
  if (!coords) return feature;

  // Check ring closure
  if (coords.length < 2) {
    issues.push(`INVALID_GEOMETRY: Feature ${feature.properties.designator} has less than 2 points`);
    return feature;
  }

  const firstPoint = coords[0];
  const lastPoint = coords[coords.length - 1];

  if (!firstPoint || !lastPoint) return feature;

  // Check if ring is closed (first and last points are the same)
  const tolerance = 0.000001;
  const isClosed = Math.abs(firstPoint[0] - lastPoint[0]) < tolerance &&
    Math.abs(firstPoint[1] - lastPoint[1]) < tolerance;

  if (!isClosed) {
    // Close the ring by adding the first point to the end
    coords.push(firstPoint);
    issues.push(`GEOMETRY_FIX: Feature ${feature.properties.designator} ring was not closed, auto-closing`);
  }

  // Check minimum points (should be at least 4 for a valid polygon: 3 unique + 1 closing)
  if (coords.length < 4) {
    issues.push(`INVALID_GEOMETRY: Feature ${feature.properties.designator} has less than 4 points`);
  }

  return feature;
}

/**
 * Generate GeoJSON FeatureCollection from parse results with validation
 */
export function generateGeoJson(result: ParseResult): string {
  // Validate all features
  const validatedFeatures = result.features.map(feature => validateGeometry(feature, result.issues));

  return JSON.stringify({
    type: 'FeatureCollection',
    features: validatedFeatures,
    metadata: {
      effectiveDate: result.effectiveDate,
      sourceUrl: result.sourceUrl,
      sha256: result.sha256,
      generatedAt: result.generatedAt,
      issues: result.issues,
      featureCount: validatedFeatures.length
    }
  }, null, 2);
}

/**
 * Fetch and parse eAIP ENR 5.1 page
 */
export async function fetchAndParseEaipEnr51(url?: string): Promise<ParseResult> {
  try {
    const targetUrl = url ?? await fetchLatestEnr5_1Url();
    const response = await fetch(targetUrl);
    const html = await response.text();

    return await parseEaipEnr51(html, targetUrl);
  } catch (error) {
    throw new Error(`Failed to fetch and parse eAIP ENR 5.1: ${error}`);
  }
}
