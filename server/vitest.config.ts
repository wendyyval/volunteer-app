import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/index.ts",           // just starts server
        "src/types/**",
        "src/config/**",
        "**/__tests__/**",
        "**/*.test.*",
        "**/*.spec.*"
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    },
    setupFiles: ["./vitest.setup.ts"]
  }
});