import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildDemoProductAssetCatalog,
  demoProductAssetFilename,
  demoProductAssetPath,
} from "./demo-product-catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = resolve(root, "public");
const catalog = buildDemoProductAssetCatalog();

test("the deterministic demo catalogue contains all 100 seeded products", () => {
  assert.equal(catalog.length, 100);
  assert.equal(new Set(catalog.map(({ sku }) => sku)).size, 100);
  assert.equal(new Set(catalog.map(({ name }) => name)).size, 100);
  assert.equal(new Set(catalog.map(({ assetPath }) => assetPath)).size, 100);
  assert.ok(catalog.every(({ assetPath }) => assetPath.startsWith("/demo-products/catalog/")));
});

test("product asset names are stable, readable, and server reproducible", () => {
  const sample = {
    sku: "DEMO-CATALOG-009",
    name: "Tata Sampann Toor Dal 500 g",
  };
  assert.equal(
    demoProductAssetFilename(sample),
    "demo-catalog-009--tata-sampann-toor-dal-500-g.svg",
  );
  assert.equal(
    demoProductAssetPath(sample),
    "/demo-products/catalog/demo-catalog-009--tata-sampann-toor-dal-500-g.svg",
  );
});

test("every committed product asset is accessible and contains its product identity", async () => {
  for (const product of catalog) {
    const path = resolve(assetRoot, product.assetPath.replace(/^\//, ""));
    const metadata = await stat(path);
    assert.ok(metadata.size > 1_000, `${product.sku} artwork is unexpectedly small`);
    const svg = await readFile(path, "utf8");
    assert.match(svg, /role="img"/);
    assert.match(svg, /ORIGINAL DEMO ARTWORK/);
    assert.ok(svg.includes(product.brand.toUpperCase()));
  }
});

test("manifest mirrors the generated catalogue and category fallbacks remain available", async () => {
  const manifest = JSON.parse(
    await readFile(resolve(assetRoot, "demo-products/catalog/manifest.json"), "utf8"),
  );
  assert.deepEqual(manifest, catalog);
  for (const fallback of ["grocery", "cooking", "dairy", "snacks"]) {
    await stat(resolve(assetRoot, `demo-products/${fallback}.svg`));
  }
});
