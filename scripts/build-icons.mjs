import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";

const iconsDir = join(process.cwd(), "icons");
const outDir = join(process.cwd(), "public");
const outFile = join(outDir, "sprite.svg");

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const files = readdirSync(iconsDir).filter((f) => f.endsWith(".svg"));

const symbols = files.map((file) => {
  const id = basename(file, ".svg");
  let content = readFileSync(join(iconsDir, file), "utf-8");
  // Extract viewBox from the svg element
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
  // Extract inner content (between <svg> tags)
  const inner = content
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")
    .trim();
  return `  <symbol id="${id}" viewBox="${viewBox}">\n    ${inner}\n  </symbol>`;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join("\n")}\n</svg>`;

writeFileSync(outFile, sprite);
console.log(`Built sprite.svg with ${files.length} icons`);
