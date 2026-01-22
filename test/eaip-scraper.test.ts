import { describe, expect, it } from "vitest";
import { resolveEnr5_1UrlFromIndexHtml } from "../tools/eaip-import/src/parser";

describe("eAIP index scraper", () => {
  it("resolves the ENR 5.1 link from an index page", () => {
    const html = `
      <html>
        <body>
          <div id="ENR-5">
            <ul>
              <li><a href="EE-ENR-5.1-en-GB.html">ENR 5.1 Prohibited Areas</a></li>
              <li><a href="EE-ENR-5.2-en-GB.html">ENR 5.2 Military Exercises</a></li>
            </ul>
          </div>
        </body>
      </html>
    `;
    const resolved = resolveEnr5_1UrlFromIndexHtml(html, "https://eaip.eans.ee/2025-12-25/html/eAIP/");

    expect(resolved).toBe("https://eaip.eans.ee/2025-12-25/html/eAIP/EE-ENR-5.1-en-GB.html");
  });
});
