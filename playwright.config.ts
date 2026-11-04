import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL;
const localChrome =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: externalBaseUrl || "http://127.0.0.1:4174",
    launchOptions: existsSync(localChrome)
      ? { executablePath: localChrome }
      : undefined,
    trace: "retain-on-failure",
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: "npm run preview -- --host 127.0.0.1 --port 4174",
        url: "http://127.0.0.1:4174",
        reuseExistingServer: false,
      },
});
