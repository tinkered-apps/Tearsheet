import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:8765";

export default defineConfig({
  testDir: "test/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "npm start",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000
  }
});
