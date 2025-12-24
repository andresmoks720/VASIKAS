import { expect, test } from "@playwright/test";

test("smoke: switch tools updates sidebar", async ({ page }) => {
  await page.goto("/air");

  await expect(page.getByRole("heading", { name: /Airplanes/ })).toBeVisible();

  await page.getByRole("button", { name: "sensors" }).click();
  await expect(page.getByRole("heading", { name: "Sensors" })).toBeVisible();
  await expect(page).toHaveURL(/\/sensors/);

  await page.getByRole("button", { name: "geofences" }).click();
  await expect(page.getByRole("heading", { name: "Geofences" })).toBeVisible();
  await expect(page).toHaveURL(/\/geofences/);

  await page.getByRole("button", { name: "history" }).click();
  await expect(page.getByRole("heading", { name: "History" })).toBeVisible();
  await expect(page).toHaveURL(/\/history/);
});
