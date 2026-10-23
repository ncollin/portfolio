import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { create } from "fontkit";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const output = new URL("public/assets/social/", root);
const sans = create(await readFile(fileURLToPath(import.meta.resolve(
  "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2",
))));
const mono = create(await readFile(fileURLToPath(import.meta.resolve(
  "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
))));
const primitives = await readFile(new URL("src/styles/tokens/primitives.css", root), "utf8");

function color(name) {
  const value = primitives.match(new RegExp(`--nc-color-${name}:\\s*(#[\\da-fA-F]{6});`))?.[1];
  if (!value) throw new Error(`Missing social image color token: ${name}`);
  return value;
}

const palette = {
  background: color("gray-slate-950"),
  text: color("gray-slate-100"),
  secondary: color("gray-slate-400"),
  border: color("gray-slate-700"),
  accent: color("blue-sky-300"),
};
const previews = [
  {
    file: "default",
    label: "FRONTEND TECH LEAD / LAVAL, QC",
    lines: ["UI foundations", "teams ship on."],
    detail: "DESIGN SYSTEMS / FRONTEND ARCHITECTURE",
  },
  {
    file: "component-library",
    label: "CASE STUDY 01 / NURUN",
    lines: ["Taking control of an", "inherited component", "library"],
    detail: "DESIGN SYSTEMS / TOKENS / SEVEN BRANDS",
  },
  {
    file: "platform-modernization",
    label: "CASE STUDY 02 / NURUN",
    lines: ["Modernizing a 10-year-old", "platform without", "stopping delivery"],
    detail: "FRONTEND ARCHITECTURE / BUILD & CI",
  },
  {
    file: "tecsys-design-practice",
    label: "CASE STUDY 03 / TECSYS",
    lines: ["Building a frontend", "and design practice", "from zero"],
    detail: "TEAM LEADERSHIP / SHARED DESIGN SYSTEM",
  },
];

// Outline glyphs so PNG rendering never depends on installed system fonts.
function text(value, font, size, x, y, fill) {
  const run = font.layout(value);
  const scale = size / font.unitsPerEm;
  const width = run.positions.reduce((sum, position) => sum + position.xAdvance, 0) * scale;
  if (width > 1056) throw new Error(`Social image text exceeds safe width: ${value}`);
  let cursor = 0;
  const paths = run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const path = `<path transform="translate(${cursor + position.xOffset} ${position.yOffset})" d="${glyph.path.toSVG()}" />`;
    cursor += position.xAdvance;
    return path;
  });
  return `<g fill="${fill}" transform="translate(${x} ${y}) scale(${scale} ${-scale})">${paths.join("")}</g>`;
}

function template(preview) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${palette.background}" />
    <rect x="72" y="64" width="48" height="4" fill="${palette.accent}" />
    ${text(preview.label, mono, 19, 72, 112, palette.accent)}
    ${preview.lines.map((line, index) => text(line, sans, 72, 72, 228 + index * 82, palette.text)).join("")}
    ${text(preview.detail, mono, 18, 72, 461, palette.secondary)}
    <path d="M72 502H1128" stroke="${palette.border}" />
    ${text("Nico Collin", sans, 27, 72, 559, palette.text)}
    ${text("nicocollin.app", mono, 19, 941, 559, palette.accent)}
  </svg>`;
}

await mkdir(output, { recursive: true });
for (const preview of previews) {
  const destination = fileURLToPath(new URL(`${preview.file}.png`, output));
  const result = await sharp(Buffer.from(template(preview)))
    .png({ compressionLevel: 9 })
    .toFile(destination);
  if (result.width !== 1200 || result.height !== 630 || result.size > 200_000) {
    throw new Error(`Social image must be 1200x630 and below 200 KB: ${destination}`);
  }
  console.log(`${preview.file}.png: 1200x630, ${(result.size / 1024).toFixed(1)} KB`);
}
