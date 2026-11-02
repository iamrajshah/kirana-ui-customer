import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const revision =
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

mkdirSync("dist", { recursive: true });
writeFileSync(
  "dist/release.json",
  `${JSON.stringify(
    {
      app: "kirana-customer",
      revision,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);
