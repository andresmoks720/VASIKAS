import { describe, expect, it, vi } from "vitest";

import { getCurrentEffectiveDate } from "./eaipDiscovery";

describe("getCurrentEffectiveDate", () => {
  it("parses the current effective date from the history page", async () => {
    const html = `
      <html>
        <body>
          <table>
            <tr>
              <td class="date"><a href="/">25 DEC 2025</a></td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(html, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentEffectiveDate()).resolves.toBe("2025-12-25");
    expect(fetchMock).toHaveBeenCalledWith("https://eaip.eans.ee/history-en-GB.html");
  });

  it("falls back to redirects when the history page lacks a date", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("<html></html>", { status: 200 }))
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { Location: "https://eaip.eans.ee/2026-01-15/" },
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    await expect(getCurrentEffectiveDate()).resolves.toBe("2026-01-15");
    expect(fetchMock).toHaveBeenCalledWith("https://eaip.eans.ee/", { redirect: "manual" });
  });

  it("falls back to regex parsing when DOMParser is unavailable", async () => {
    const html = `
      <html>
        <body>
          <p>Currently Effective Issue: 02 FEB 2027</p>
        </body>
      </html>
    `;

    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(html, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    vi.stubGlobal("DOMParser", undefined);
    try {
      await expect(getCurrentEffectiveDate()).resolves.toBe("2027-02-02");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
