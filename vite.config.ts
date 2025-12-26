import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
    exclude: ["node_modules/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/mocks/**",
        "src/test/**",
        "**/*.d.ts",
        "**/index.ts",
        "**/index.tsx",
        "src/app/main.tsx",
      ],
      thresholds: {
        lines: 74,
        statements: 74,
        branches: 55,
        functions: 60,
      },
    },
  },
});
