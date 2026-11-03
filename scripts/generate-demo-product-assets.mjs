import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildDemoProductAssetCatalog,
  demoProductAssetFilename,
} from "./demo-product-catalog.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/demo-products");
const catalogOutput = resolve(output, "catalog");
const themes = [
  ["grocery", "Everyday Grocery", "#087f5b", "#d9f5e8"],
  ["daily-essentials", "Daily Essentials", "#1677ff", "#dcebff"],
  ["cooking", "Cooking Essentials", "#e67700", "#fff0d4"],
  ["snacks", "Snacks", "#c2255c", "#ffe3ef"],
  ["beverages", "Beverages", "#1971c2", "#dff2ff"],
  ["home-care", "Home Care", "#6741d9", "#eee8ff"],
  ["personal-care", "Personal Care", "#a61e4d", "#ffe3ec"],
  ["pulses-grains", "Pulses & Grains", "#9c6b00", "#fff3bf"],
  ["spices", "Spices", "#d9480f", "#ffe8cc"],
  ["breakfast", "Breakfast", "#2b8a3e", "#e6f7e9"],
  ["dairy", "Dairy", "#1864ab", "#e7f5ff"],
  ["household", "Household", "#495057", "#edf0f2"],
];

await mkdir(output, { recursive: true });
for (const [slug, label, accent, soft] of themes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="${label}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${soft}"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>
  <rect width="600" height="600" rx="42" fill="url(#bg)"/>
  <circle cx="470" cy="116" r="92" fill="${accent}" opacity=".1"/>
  <path d="M190 192h220l34 296H156z" fill="#fff" stroke="${accent}" stroke-width="16"/>
  <path d="M219 192c0-70 35-106 81-106s81 36 81 106" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
  <rect x="192" y="270" width="216" height="124" rx="22" fill="${accent}"/>
  <text x="300" y="323" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="25" font-weight="700">KIRANA DEMO</text>
  <text x="300" y="360" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="20">${label}</text>
  <text x="300" y="548" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-size="24" font-weight="700">Fresh • Trusted • Local</text>
</svg>`;
  await writeFile(resolve(output, `${slug}.svg`), svg);
}

const xml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const categoryPalette = {
  "Pulses & Grains": ["#9c6b00", "#fff3bf", "#e4ae36"],
  Cooking: ["#d9480f", "#fff0d4", "#f59f00"],
  Spices: ["#c92a2a", "#ffe3e3", "#f08c00"],
  Beverages: ["#1864ab", "#dff2ff", "#15aabf"],
  Snacks: ["#c2255c", "#ffe3ef", "#f06595"],
  Breakfast: ["#2b8a3e", "#e6f7e9", "#74b816"],
  Dairy: ["#1971c2", "#e7f5ff", "#4dabf7"],
  "Home Care": ["#6741d9", "#eee8ff", "#9775fa"],
  "Personal Care": ["#a61e4d", "#ffe3ec", "#e64980"],
  Household: ["#495057", "#edf0f2", "#868e96"],
  "Daily Essentials": ["#087f5b", "#d9f5e8", "#20c997"],
};

const productLines = (value) => {
  const words = value.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (`${current} ${word}`.trim().length > 17 && current) {
      lines.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
};

const labelText = (product, accent) => {
  const lines = productLines(product.item);
  const offset = Math.max(0, lines.length - 1) * 18;
  return `<text x="300" y="282" text-anchor="middle" fill="#263238" font-family="Arial, sans-serif" font-size="24" font-weight="700">${lines
    .map((line, index) => `<tspan x="300" dy="${index === 0 ? 0 : 29}">${xml(line)}</tspan>`)
    .join("")}</text>
  <rect x="226" y="${340 + offset}" width="148" height="45" rx="22" fill="${accent}"/>
  <text x="300" y="${371 + offset}" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="22" font-weight="700">${xml(product.size)}</text>`;
};

const packageShape = (product, accent, secondary) => {
  const label = labelText(product, accent);
  const common = `fill="#fff" stroke="${accent}" stroke-width="10"`;
  switch (product.packaging) {
    case "BOTTLE":
      return `<rect x="258" y="112" width="84" height="45" rx="10" fill="${secondary}" stroke="${accent}" stroke-width="8"/>
      <path d="M252 150h96l23 58v238c0 22-18 40-40 40h-62c-22 0-40-18-40-40V208z" ${common}/>${label}`;
    case "JAR":
      return `<rect x="220" y="132" width="160" height="38" rx="9" fill="${secondary}" stroke="${accent}" stroke-width="9"/>
      <rect x="206" y="164" width="188" height="304" rx="48" ${common}/>${label}`;
    case "BOX":
      return `<path d="M210 134h180l28 34v306H182V168z" ${common}/>
      <path d="M182 168h236M210 134l22 34M390 134l-22 34" fill="none" stroke="${secondary}" stroke-width="9"/>${label}`;
    case "POUCH":
      return `<path d="M202 134h196l24 332c-64 28-180 28-244 0z" ${common}/>
      <path d="M202 156h196M194 442c66 20 146 20 212 0" fill="none" stroke="${secondary}" stroke-width="9"/>${label}`;
    default:
      return `<rect x="190" y="136" width="220" height="334" rx="28" ${common}/>
      <path d="M205 166h190M205 438h190" stroke="${secondary}" stroke-width="9" stroke-linecap="round"/>${label}`;
  }
};

await mkdir(catalogOutput, { recursive: true });
const catalog = buildDemoProductAssetCatalog();
for (const product of catalog) {
  const [accent, soft, secondary] = categoryPalette[product.category] ?? [
    "#087f5b",
    "#d9f5e8",
    "#20c997",
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" role="img" aria-label="${xml(product.name)} demo artwork">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${soft}"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#17352c" flood-opacity=".16"/></filter>
  </defs>
  <rect width="600" height="600" rx="42" fill="url(#background)"/>
  <circle cx="102" cy="116" r="66" fill="${secondary}" opacity=".16"/>
  <circle cx="507" cy="180" r="94" fill="${accent}" opacity=".10"/>
  <g filter="url(#shadow)">${packageShape(product, accent, secondary)}</g>
  <rect x="190" y="203" width="220" height="53" rx="15" fill="${accent}"/>
  <text x="300" y="238" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="21" font-weight="800">${xml(product.brand.toUpperCase())}</text>
  <text x="300" y="538" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-size="18" font-weight="700">${xml(product.category)}</text>
  <text x="300" y="568" text-anchor="middle" fill="#52625d" font-family="Arial, sans-serif" font-size="13" letter-spacing="2">ORIGINAL DEMO ARTWORK</text>
</svg>`;
  await writeFile(resolve(catalogOutput, demoProductAssetFilename(product)), svg);
}

await writeFile(
  resolve(catalogOutput, "manifest.json"),
  `${JSON.stringify(catalog, null, 2)}\n`,
);

process.stdout.write(
  `Generated ${catalog.length} product assets and ${themes.length} fallback assets.\n`,
);
