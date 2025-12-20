import { describe, expect, it } from "vitest";

import { formatNotamSummary, sanitizeText, truncateText } from "./notamTypes";

describe("sanitizeText", () => {
    it("removes control characters", () => {
        expect(sanitizeText("Hello\x00World\x1F!")).toBe("Hello World !");
    });

    it("collapses whitespace", () => {
        expect(sanitizeText("Hello   World\n\t!")).toBe("Hello World !");
    });

    it("trims leading and trailing whitespace", () => {
        expect(sanitizeText("  Hello World  ")).toBe("Hello World");
    });

    it("handles empty string", () => {
        expect(sanitizeText("")).toBe("");
    });
});

describe("truncateText", () => {
    it("returns short text unchanged", () => {
        expect(truncateText("Hello World", 80)).toBe("Hello World");
    });

    it("truncates at word boundary when possible", () => {
        const longText = "This is a very long text that definitely needs truncation soon";
        const result = truncateText(longText, 50);
        expect(result.length).toBeLessThanOrEqual(50);
        expect(result).toMatch(/…$/);
        // Should cut at "truncation" since space is at position 48
        expect(result).toBe("This is a very long text that definitely needs…");
    });

    it("truncates mid-word when no good boundary exists", () => {
        const result = truncateText("Supercalifragilisticexpialidocious", 10);
        expect(result).toBe("Supercali…");
    });

    it("uses default max length of 80", () => {
        const longText = "A".repeat(100);
        expect(truncateText(longText).length).toBe(80);
    });
});

describe("formatNotamSummary", () => {
    it("sanitizes and truncates text", () => {
        const dirtyLongText = "TEMP\x00RESTRICTED   AREA\n" + "X".repeat(100);
        const result = formatNotamSummary(dirtyLongText, 30);

        expect(result).not.toMatch(/\x00/);
        expect(result).not.toMatch(/\s{2,}/);
        expect(result.length).toBeLessThanOrEqual(30);
    });

    it("handles typical NOTAM text", () => {
        const notamText = "TEMP RESTRICTED AREA PSN 582200N 0245000E RADIUS 10NM SFC TO 3000FT AMSL";
        const result = formatNotamSummary(notamText, 50);

        expect(result).toBe("TEMP RESTRICTED AREA PSN 582200N 0245000E RADIUS…");
    });
});
