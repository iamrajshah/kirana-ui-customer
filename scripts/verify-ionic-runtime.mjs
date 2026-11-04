import { readFile, realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const compatibleStencilVersion = "4.12.2";

export async function verifyInstalledIonicRuntime(projectRoot = process.cwd()) {
  const projectRequire = createRequire(resolve(projectRoot, "package.json"));
  const reactPackage = await realpath(
    projectRequire.resolve("@ionic/react/package.json"),
  );
  const reactRequire = createRequire(reactPackage);
  const corePackage = await realpath(
    reactRequire.resolve("@ionic/core/package.json"),
  );
  const coreRequire = createRequire(corePackage);
  const iconsPackage = await realpath(
    coreRequire.resolve("ionicons/package.json"),
  );
  const results = [];

  for (const [name, packageFile] of [
    ["Ionic", corePackage],
    ["Ionicons", iconsPackage],
  ]) {
    const dependencyRequire = createRequire(packageFile);
    const runtimePackage = await realpath(
      dependencyRequire.resolve("@stencil/core/package.json"),
    );
    const runtimeEntry = await realpath(
      dependencyRequire.resolve("@stencil/core/internal/client"),
    );
    const metadata = JSON.parse(await readFile(runtimePackage, "utf8"));
    const entryRelative = relative(dirname(runtimePackage), runtimeEntry);
    if (
      metadata.version !== compatibleStencilVersion ||
      entryRelative.startsWith("..")
    ) {
      throw new Error(
        `${name} resolves Stencil ${metadata.version}; Ionic 7 requires ${compatibleStencilVersion}. Run npm ci before building. Do not deploy an older dist directory.`,
      );
    }
    results.push({ consumer: name, runtimeVersion: metadata.version });
  }
  return results;
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  try {
    const runtimes = await verifyInstalledIonicRuntime();
    console.log(JSON.stringify({ ionicRuntime: "verified", runtimes }));
  } catch (error) {
    console.error(`Ionic runtime verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
