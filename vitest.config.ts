import { defineConfig } from "vitest/config";

// Scoped to plain-TS unit tests for pure logic (src/lib/*.test.ts) -- no
// Next.js/React rendering involved, so no need for a DOM environment or
// Next's own build tooling here.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
