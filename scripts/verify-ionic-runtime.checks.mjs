import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { verifyInstalledIonicRuntime } from "./verify-ionic-runtime.mjs";

async function packageAt(root, name, version) {
  const directory = join(root, "node_modules", name);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, "package.json"),
    JSON.stringify({ name, version }),
  );
  return directory;
}

async function runtimeAt(root, version) {
  const directory = await packageAt(root, "@stencil/core", version);
  await mkdir(join(directory, "internal", "client"), { recursive: true });
  await writeFile(
    join(directory, "internal", "client", "index.js"),
    "export {};\n",
  );
}

async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), "kirana-ionic-runtime-"));
  try {
    await writeFile(join(root, "package.json"), "{}");
    await packageAt(root, "@ionic/react", "7.8.6");
    const core = await packageAt(root, "@ionic/core", "7.8.6");
    const icons = await packageAt(root, "ionicons", "7.4.0");
    await runtimeAt(core, "4.12.2");
    await runtimeAt(icons, "4.12.2");
    await run({ root, core, icons });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("verifies the nested runtimes actually resolved by Ionic and Ionicons", () =>
  fixture(async ({ root }) => {
    assert.deepEqual(await verifyInstalledIonicRuntime(root), [
      { consumer: "Ionic", runtimeVersion: "4.12.2" },
      { consumer: "Ionicons", runtimeVersion: "4.12.2" },
    ]);
  }));

test("rejects an incompatible nested runtime even when the root runtime is compatible", () =>
  fixture(async ({ root, core }) => {
    await runtimeAt(root, "4.12.2");
    await runtimeAt(core, "4.43.0");
    await assert.rejects(
      verifyInstalledIonicRuntime(root),
      /Ionic resolves Stencil 4\.43\.0/,
    );
  }));

test("rejects Ionicons runtime drift independently", () =>
  fixture(async ({ root, icons }) => {
    await runtimeAt(icons, "4.43.0");
    await assert.rejects(
      verifyInstalledIonicRuntime(root),
      /Ionicons resolves Stencil 4\.43\.0/,
    );
  }));

test("follows a linked Ionic package to its real dependency context", () =>
  fixture(async ({ root, core }) => {
    const linkedCore = join(root, "linked-core");
    await mkdir(linkedCore);
    await writeFile(
      join(linkedCore, "package.json"),
      JSON.stringify({ name: "@ionic/core", version: "7.8.6" }),
    );
    await runtimeAt(root, "4.12.2");
    await runtimeAt(linkedCore, "4.43.0");
    await rm(core, { recursive: true, force: true });
    await symlink(linkedCore, core, "dir");
    await assert.rejects(
      verifyInstalledIonicRuntime(root),
      /Ionic resolves Stencil 4\.43\.0/,
    );
  }));
