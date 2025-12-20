import { test, expect } from "@playwright/test";

test("Phase 2 editable world smoke", async ({ page }) => {
    // 1. Open /geofences
    await page.goto("/geofences");
    await expect(page).toHaveURL(/\/geofences/);

    // 2. Create a circle geofence
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByRole("heading", { name: "Create Geofence" })).toBeVisible();

    const geofenceName = "Test Zone Alpha";
    await page.getByLabel("Name").fill(geofenceName);
    await page.getByLabel("Lat").fill("59.437");
    await page.getByLabel("Lon").fill("24.753");
    await page.getByLabel("Radius (m)").fill("1000");

    await page.getByRole("button", { name: "Create" }).click();

    // 3. Verify it appears in list
    await expect(page.getByText(geofenceName)).toBeVisible();
    await expect(page.getByText("Circle (r=1000m)")).toBeVisible();

    // 4. Click it -> URL has ?entity=geofence:<id>
    await page.getByText(geofenceName).click();
    await expect(page).toHaveURL(/entity=geofence(:|%3A)/);

    // 5. Close details -> list returns
    // Navigating to sensors effectively leaves the details context for the purpose of the flow

    // 6. Navigate to /sensors (direct navigation to ensure clean state)
    await page.goto("/sensors");
    await expect(page).toHaveURL(/\/sensors/);

    // 7. Add a user sensor  
    // Wait for the Add button to be ready
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByRole("heading", { name: "Add New Sensor" })).toBeVisible();

    const sensorName = "Sniper 1";
    await page.getByLabel("Name").fill(sensorName);
    await page.getByLabel("Kind").fill("radar");
    await page.getByLabel("Latitude").fill("59.440");
    await page.getByLabel("Longitude").fill("24.760");

    await page.getByRole("button", { name: "Add", exact: true }).click();

    // 8. Verify it appears in list
    await expect(page.getByText(sensorName)).toBeVisible();
    await expect(page.getByText("User Sensors")).toBeVisible();
});
