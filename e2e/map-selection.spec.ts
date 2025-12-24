import { expect, test } from "@playwright/test";

test.describe("map selection", () => {
  test("clicking a flight marker updates the URL entity", async ({ page }) => {
    await page.goto("/airplanes");

    await expect(page.getByRole("heading", { name: /airplanes/i })).toBeVisible();
    await expect(page.getByText("FIN123")).toBeVisible();

    await page.waitForFunction(() =>
      Boolean(window.__debugMap?.getFeaturePixel?.("flight", "4ca123")),
    );

    const pixel = await page.evaluate(() =>
      window.__debugMap?.getFeaturePixel("flight", "4ca123"),
    );
    expect(pixel).not.toBeNull();

    const mapBounds = await page.getByTestId("map-root").boundingBox();
    expect(mapBounds).not.toBeNull();

    if (!pixel || !mapBounds) {
      throw new Error("Missing map bounds or feature pixel.");
    }

    await page.mouse.click(mapBounds.x + pixel.x, mapBounds.y + pixel.y);
    await expect(page).toHaveURL(/entity=flight%3A4ca123/);
  });
});
