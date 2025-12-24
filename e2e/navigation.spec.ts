import { expect, test } from "@playwright/test";

test.describe("tool navigation", () => {
  test("switches tools via top toolbar", async ({ page }) => {
    await page.goto("/air");

    await expect(page.getByRole("heading", { name: /airplanes/i })).toBeVisible();

    await page.getByRole("button", { name: /sensors/i }).click();
    await expect(page.getByRole("heading", { name: /sensors/i })).toBeVisible();

    await page.getByRole("button", { name: /geofences/i }).click();
    await expect(page.getByRole("heading", { name: /geofences/i })).toBeVisible();

    await page.getByRole("button", { name: /history/i }).click();
    await expect(page.getByRole("heading", { name: /history/i })).toBeVisible();
  });
});
