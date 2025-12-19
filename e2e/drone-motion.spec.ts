import { expect, test } from "@playwright/test";

const DRONE_ID = "drone-001";

test.describe("drone motion", () => {
  test("drone position updates after polling", async ({ page }) => {
    await page.goto("/air");

    const firstPositionHandle = await page.waitForFunction((droneId) => {
      const coords = window.__debugMap?.getFeaturePosition("drone", droneId);
      if (!coords) return undefined;
      const [lon, lat] = coords;
      return { lon, lat };
    }, DRONE_ID);

    const firstPosition = await firstPositionHandle.jsonValue();
    expect(firstPosition).toBeTruthy();

    await page.waitForTimeout(2200);

    const updatedHandle = await page.waitForFunction(
      ({ previous, droneId }) => {
        const coords = window.__debugMap?.getFeaturePosition("drone", droneId);
        if (!coords) return undefined;
        const [lon, lat] = coords;
        if (!previous) return { lon, lat };
        if (lon !== previous.lon || lat !== previous.lat) {
          return { lon, lat };
        }
        return undefined;
      },
      { previous: firstPosition, droneId: DRONE_ID },
      { timeout: 5000 },
    );

    const updatedPosition = await updatedHandle.jsonValue();

    expect(updatedPosition).toBeTruthy();
    expect(updatedPosition.lon).not.toBeCloseTo(firstPosition.lon, 6);
    expect(updatedPosition.lat).not.toBeCloseTo(firstPosition.lat, 6);
  });
});
