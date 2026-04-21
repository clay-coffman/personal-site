import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";

const iconsDir = join(process.cwd(), "icons");
const outDir = join(process.cwd(), "public");
const outFile = join(outDir, "sprite.svg");

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const files = readdirSync(iconsDir).filter((f) => f.endsWith(".svg"));

// Preserve styling attributes from the source svg onto the symbol so each
// icon keeps its own fill/stroke regardless of the sprite consumer.
const PRESERVED_ATTRS = [
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
];

const symbols = files.map((file) => {
  const id = basename(file, ".svg");
  const content = readFileSync(join(iconsDir, file), "utf-8");
  const openTagMatch = content.match(/<svg([^>]*)>/);
  const openAttrs = openTagMatch ? openTagMatch[1] : "";
  const viewBoxMatch = openAttrs.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
  const preserved = PRESERVED_ATTRS.map((attr) => {
    const m = openAttrs.match(new RegExp(`${attr}="([^"]+)"`));
    return m ? `${attr}="${m[1]}"` : null;
  })
    .filter(Boolean)
    .join(" ");
  const inner = content
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();
  const attrs = [`id="${id}"`, `viewBox="${viewBox}"`, preserved]
    .filter(Boolean)
    .join(" ");
  return `  <symbol ${attrs}>\n    ${inner}\n  </symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>`;

writeFileSync(outFile, sprite);
console.log(`Built sprite.svg with ${files.length} icons`);
