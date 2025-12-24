import { expect, test } from "@playwright/test";

test.describe("smoke path", () => {
  test("creates geofence, adds sensor, and updates URL on selection", async ({ page }) => {
    await page.goto("/air");

    await expect(page.locator("canvas").first()).toBeVisible();

    await page.getByRole("button", { name: /geofences/i }).click();
    await expect(page.getByRole("heading", { name: /geofences/i })).toBeVisible();

    await page.getByRole("button", { name: "Add" }).click();
    const geofenceDialog = page.getByRole("dialog", { name: "Create Geofence" });
    await geofenceDialog.getByRole("textbox", { name: "Name" }).fill("Zone A");
    await geofenceDialog.getByRole("textbox", { name: "Lat" }).fill("59.5");
    await geofenceDialog.getByRole("textbox", { name: "Lon" }).fill("24.5");
    await geofenceDialog.getByRole("spinbutton", { name: "Radius (m)" }).fill("250");
    await geofenceDialog.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Zone A")).toBeVisible();

    await page.getByRole("button", { name: /sensors/i }).click();
    await expect(page.getByRole("heading", { name: /sensors/i })).toBeVisible();

    await page.getByRole("button", { name: "Add" }).click();
    const sensorDialog = page.getByRole("dialog", { name: "Add New Sensor" });
    await sensorDialog.getByRole("textbox", { name: "Name" }).fill("Sensor Alpha");
    await sensorDialog.getByRole("textbox", { name: "Latitude" }).fill("59.51");
    await sensorDialog.getByRole("textbox", { name: "Longitude" }).fill("24.51");
    await sensorDialog.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Sensor Alpha")).toBeVisible();

    await page.getByText("Sensor Alpha").click();
    await expect(page).toHaveURL(/entity=sensor%3A/);
  });
});
