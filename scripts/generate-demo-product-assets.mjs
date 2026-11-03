import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "public/demo-products");
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
