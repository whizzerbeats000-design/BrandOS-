import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3111",
    headless: true,
    launchOptions: {
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    },
  },
  webServer: {
    command: "next start -p 3111",
    port: 3111,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
