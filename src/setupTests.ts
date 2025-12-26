import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";

import { resetMockHandlers, server } from "./mocks/server";

class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}

(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = ResizeObserver;

console.log("[setupTests] Setting up MSW server...");
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());
afterEach(() => resetMockHandlers());

afterAll(() => server.close());
