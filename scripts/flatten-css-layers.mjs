import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { transform } from "lightningcss";

const outputRoots = [".output/public", ".vercel/output/static"];

function isBoundary(source, index) {
  const previous = source[index - 1];
  return !previous || /[\s{};]/.test(previous);
}

function skipString(source, index) {
  const quote = source[index];
  index += 1;

  while (index < source.length) {
    if (source[index] === "\\") {
      index += 2;
      continue;
    }
    if (source[index] === quote) return index + 1;
    index += 1;
  }

  return index;
}

function skipComment(source, index) {
  const end = source.indexOf("*/", index + 2);
  return end === -1 ? source.length : end + 2;
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];

    if (char === '"' || char === "'") {
      index = skipString(source, index) - 1;
      continue;
    }

    if (char === "/" && source[index + 1] === "*") {
      index = skipComment(source, index) - 1;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function findMatchingBraceNaive(source, openIndex) {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function flattenLayers(source) {
  let output = "";
  let index = 0;

  while (index < source.length) {
    if (source[index] === '"' || source[index] === "'") {
      const next = skipString(source, index);
      output += source.slice(index, next);
      index = next;
      continue;
    }

    if (source[index] === "/" && source[index + 1] === "*") {
      const next = skipComment(source, index);
      output += source.slice(index, next);
      index = next;
      continue;
    }

    if (source.startsWith("@layer", index) && isBoundary(source, index)) {
      let cursor = index + "@layer".length;
      while (/\s/.test(source[cursor] ?? "")) cursor += 1;

      while (
        cursor < source.length &&
        source[cursor] !== "{" &&
        source[cursor] !== ";"
      ) {
        cursor += 1;
      }

      if (source[cursor] === ";") {
        index = cursor + 1;
        continue;
      }

      if (source[cursor] === "{") {
        let close = findMatchingBrace(source, cursor);
        if (close === -1) close = findMatchingBraceNaive(source, cursor);
        if (close !== -1) {
          output += flattenLayers(source.slice(cursor + 1, close));
          index = close + 1;
          continue;
        }
      }
    }

    output += source[index];
    index += 1;
  }

  return output;
}

async function findCssFiles(root) {
  const files = [];

  async function walk(directory) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && path.endsWith(".css")) files.push(path);
    }
  }

  await walk(root);
  return files;
}

const cssFiles = (
  await Promise.all(outputRoots.map((root) => findCssFiles(root)))
).flat();

await Promise.all(
  cssFiles.map(async (file) => {
    const source = await readFile(file, "utf8");
    const flattened = flattenLayers(source);
    const { code } = transform({
      code: Buffer.from(flattened),
      filename: file,
      minify: true,
      targets: {
        safari: 13 << 16,
      },
    });
    const transformed = code.toString();
    if (transformed !== source) await writeFile(file, transformed);
  }),
);

if (cssFiles.length > 0) {
  console.log(`Flattened CSS cascade layers in ${cssFiles.length} file(s).`);
}
