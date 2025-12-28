import { AirspaceFeature } from './airspaceTypes';
import { parseEaipEnr51Core, ParserElement } from './htmlParserCore';

// Version constant for the HTML parser
export const HTML_PARSER_VERSION = "2.0.0";

/**
 * Native DOM-based element wrapper for htmlParserCore
 */
export class DomParserElement implements ParserElement {
  constructor(private element: Element | Document) { }

  querySelector(selector: string): ParserElement | null {
    const el = this.element.querySelector(selector);
    return el ? new DomParserElement(el) : null;
  }

  querySelectorAll(selector: string): ParserElement[] {
    const elements = this.element.querySelectorAll(selector);
    return Array.from(elements).map(el => new DomParserElement(el));
  }

  getAttribute(name: string): string | null {
    return (this.element as Element).getAttribute?.(name) || null;
  }

  get textContent(): string | null {
    return this.element.textContent;
  }

  get innerHTML(): string | null {
    return (this.element as Element).innerHTML || null;
  }
}

/**
 * Parse eAIP ENR 5.1 HTML content into AirspaceFeatures using native DOMParser or provided engine
 */
export async function parseEaipEnr51(html: string, sourceUrl: string, options?: {
  engine?: (html: string) => ParserElement;
  doc?: Document;
}): Promise<{
  features: AirspaceFeature[];
  issues: string[];
  effectiveDate?: string;
  sourceUrl: string;
  generatedAt: string;
  parserVersion?: string;
}> {
  let root: ParserElement;

  if (options?.engine) {
    root = options.engine(html);
  } else if (options?.doc) {
    root = new DomParserElement(options.doc);
  } else if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    root = new DomParserElement(doc);
  } else {
    throw new Error('No HTML parser available. In non-browser environments, please provide an engine.');
  }

  const { features, issues, effectiveDate } = parseEaipEnr51Core(root, sourceUrl);

  return {
    features,
    issues,
    effectiveDate,
    sourceUrl,
    generatedAt: new Date().toISOString(),
    parserVersion: HTML_PARSER_VERSION
  };
}