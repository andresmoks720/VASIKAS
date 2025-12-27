import { describe, expect, it } from "vitest";

import { formatUpdateAge } from "./updateAge";

describe("formatUpdateAge", () => {
  it("returns the no-updates label when age is null", () => {
    expect(formatUpdateAge(null)).toBe("No updates yet");
  });

  it("formats seconds with explicit wording", () => {
    expect(formatUpdateAge(0)).toBe("Updated: 0 seconds ago");
    expect(formatUpdateAge(1)).toBe("Updated: 1 second ago");
    expect(formatUpdateAge(59)).toBe("Updated: 59 seconds ago");
  });

  it("formats minutes for ages above one minute", () => {
    expect(formatUpdateAge(60)).toBe("Updated: 1 minute ago");
    expect(formatUpdateAge(121)).toBe("Updated: 2 minutes ago");
  });
});
