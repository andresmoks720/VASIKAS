import { expect, test } from "@playwright/test";

const AIRCRAFT_ID = "4ca123";

test.describe("aircraft motion", () => {
  test("aircraft position updates over time", async ({ page }) => {
    await page.goto("/air");

    const initialHandle = await page.waitForFunction((aircraftId) => {
      const coords = window.__debugMap?.getFeaturePosition("aircraft", aircraftId);
      if (!coords) return undefined;
      const [lon, lat] = coords;
      return { lon, lat };
    }, AIRCRAFT_ID);

    const initialPosition = await initialHandle.jsonValue();
    expect(initialPosition).toBeTruthy();

    await page.waitForTimeout(2100);

    const updatedHandle = await page.waitForFunction(
      ({ aircraftId, previous }) => {
        const coords = window.__debugMap?.getFeaturePosition("aircraft", aircraftId);
        if (!coords) return undefined;
        const [lon, lat] = coords;
        if (!previous) return { lon, lat };
        if (lon !== previous.lon || lat !== previous.lat) {
          return { lon, lat };
        }
        return undefined;
      },
      { aircraftId: AIRCRAFT_ID, previous: initialPosition },
      { timeout: 5000 },
    );

    const updatedPosition = await updatedHandle.jsonValue();
    expect(updatedPosition).toBeTruthy();
    expect(updatedPosition.lon).not.toBeCloseTo(initialPosition.lon, 6);
    expect(updatedPosition.lat).not.toBeCloseTo(initialPosition.lat, 6);
  });
});
