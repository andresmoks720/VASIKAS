import { expect, test } from "@playwright/test";

test.describe("basemap offline mode", () => {
  test("does not request external tiles when mocks are enabled", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => {
      requests.push(request.url());
    });

    await page.goto("/air");
    await expect(page.locator("canvas").first()).toBeVisible();

    const externalRequests = requests.filter((url) => {
      if (url.startsWith("data:")) return false;
      if (url.startsWith("http://127.0.0.1:4173")) return false;
      if (url.startsWith("http://localhost:4173")) return false;
      if (url.startsWith("ws://127.0.0.1:4173")) return false;
      if (url.startsWith("ws://localhost:4173")) return false;
      return true;
    });

    expect(externalRequests).toEqual([]);
  });

  test("falls back to the online basemap when offline tiles fail", async ({ page }) => {
    const osmRequests: string[] = [];
    const tilePng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAKeGdUgAAAAASUVORK5CYII=",
      "base64",
    );

    await page.route("**/tiles/demo/**", (route) => {
      route.fulfill({ status: 404 });
    });

    await page.route("**://tile.openstreetmap.org/**", (route) => {
      osmRequests.push(route.request().url());
      route.fulfill({
        status: 200,
        contentType: "image/png",
        body: tilePng,
      });
    });

    await page.goto("/air");

    await expect.poll(() => osmRequests.length).toBeGreaterThan(0);
  });
});
