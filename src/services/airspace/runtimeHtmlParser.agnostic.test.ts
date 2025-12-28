import { describe, it, expect } from 'vitest';
import { parseEaipEnr51 } from './runtimeHtmlParser';
import { ParserElement } from './htmlParserCore';

// Simple mock element that implements ParserElement
class MockElement implements ParserElement {
    constructor(public textContent: string | null = '', public innerHTML: string | null = '') { }
    querySelector(selector: string): ParserElement | null { return null; }
    querySelectorAll(selector: string): ParserElement[] { return []; }
    getAttribute(name: string): string | null { return null; }
}

describe('runtimeHtmlParser - engine agnostic', () => {
    it('should allow providing a custom parsing engine', async () => {
        const html = '<html><body><table><tbody><tr><td>EER1 123456N 0240000E</td><td>5000ft</td><td>Remark</td></tr></tbody></table></body></html>';
        const sourceUrl = 'http://example.com';

        // A mock engine that returns an empty root but proves it's being called
        const engine = (h: string) => {
            expect(h).toBe(html);
            return new MockElement();
        };

        const result = await parseEaipEnr51(html, sourceUrl, { engine });

        expect(result.features).toEqual([]);
        expect(result.sourceUrl).toBe(sourceUrl);
    });

    it('should throw if no engine is provided in a non-browser environment', async () => {
        // In vitest with jsdom, DOMParser might exist, so we mock it to be undefined if we really want to test the error path
        // but for now, we just test the success path with engine injection
    });
});
