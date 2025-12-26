import { expect, test } from "@playwright/test";

test("notam geometry smoke: features render with sane extent", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/test/notam-geometry");

  await expect(page.getByTestId("notam-ready")).toHaveText("ready");

  const featureCount = page.getByTestId("notam-feature-count");
  await expect(featureCount).toHaveText("7");

  const extent = page.getByTestId("notam-extent");
  const width = Number(await extent.getAttribute("data-width"));
  const height = Number(await extent.getAttribute("data-height"));

  expect(Number.isFinite(width)).toBe(true);
  expect(Number.isFinite(height)).toBe(true);
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);
  expect(width).toBeLessThan(20_000_000);
  expect(height).toBeLessThan(20_000_000);

  await page.waitForTimeout(250);
  await page.screenshot({ path: testInfo.outputPath("notam-geometry.png"), fullPage: true });
});
