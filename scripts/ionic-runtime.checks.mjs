import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const compatibleStencilVersion = "4.12.2";

test("pins the Stencil runtime compiled for Ionic 7", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.equal(
    packageJson.overrides?.["@stencil/core"],
    compatibleStencilVersion,
  );
});

test("locks every installed Stencil runtime to the compatible version", async () => {
  const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
  const stencilPackages = Object.entries(lock.packages)
    .filter(([location]) => location.endsWith("node_modules/@stencil/core"))
    .map(([location, metadata]) => ({ location, version: metadata.version }));

  assert.ok(stencilPackages.length > 0, "The lockfile must contain Stencil.");
  assert.deepEqual(
    [...new Set(stencilPackages.map(({ version }) => version))],
    [compatibleStencilVersion],
    `Unexpected Stencil runtimes: ${JSON.stringify(stencilPackages)}`,
  );
});
