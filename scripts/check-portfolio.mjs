import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

// Run against a running preview: node scripts/check-portfolio.mjs <base URL>
const base = new URL(process.argv[2] ?? "http://localhost:3000");
const response = await fetch(base);
assert.equal(response.status, 200, "Home page must respond successfully");
const html = await response.text();
assert.equal(
  (html.match(/<h1(?:\s|>)/g) ?? []).length,
  1,
  "Use one main heading",
);
assert.match(html, /Juan Quenga/);
assert.match(html, /mailto:juanquenga@gmail\.com/);
assert.match(html, /https:\/\/github\.com\/JuanQuenga/);
assert.doesNotMatch(html, /piggies/i, "Removed project must not be published");
for (const id of ["work", "about", "contact"]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing ${id} destination`);
  assert.match(html, new RegExp(`href="#${id}"`), `Missing ${id} navigation`);
}
for (const [host, image] of [
  ["volt-scanner.vercel.app", "volt"],
  ["clashcrown.vercel.app", "clashcrown"],
  ["brawlstatsio.vercel.app", "brawlstats"],
  ["hermans.vercel.app", "hermans"],
  ["multi-auto.vercel.app", "multi-auto"],
]) {
  assert.ok(html.includes(`https://${host}`), `Missing project ${host}`);
  assert.ok(
    html.includes(`/screenshots/${image}.png`),
    `Missing preview ${image}`,
  );
  const asset = await fetch(new URL(`/screenshots/${image}.png`, base));
  assert.equal(asset.status, 200, `Preview ${image} must load`);
  assert.match(asset.headers.get("content-type") ?? "", /image\/png/);
}
const source = await readFile(
  new URL("../components/portfolio-experience.tsx", import.meta.url),
  "utf8",
);
assert.doesNotMatch(source, /piggies/i);
await assert.rejects(
  access(new URL("../public/screenshots/piggies.png", import.meta.url)),
  "Removed project screenshot must not remain publicly served",
);
const removedAsset = await fetch(new URL("/screenshots/piggies.png", base));
assert.equal(removedAsset.status, 404, "Removed screenshot must return 404");
console.log(
  "Portfolio checks passed: SSR, navigation, contact, five previews, and removed project.",
);
