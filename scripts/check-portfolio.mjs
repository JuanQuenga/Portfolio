import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

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
assert.doesNotMatch(
  html,
  /Software engineer in Southeast Michigan/,
  "Do not restore the hero eyebrow",
);
assert.equal(
  (html.match(/lucide-arrow-up-right/g) ?? []).length,
  6,
  "Keep exactly one external-link arrow per project",
);
assert.doesNotMatch(html, /lucide-arrow-down|contact-arrow|↗/);
assert.match(html, /<select[^>]*class="theme-select"/);
for (const theme of ["system", "light", "dark"]) {
  assert.ok(html.includes(`value="${theme}"`), `Missing ${theme} choice`);
}

// Exercise the actual SSR bootstrap before hydration. This must choose the
// correct palette before the first paint, independently of React mounting.
const bootstrap = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .find((script) => script.includes('"portfolio-theme"'));
assert.ok(bootstrap, "Theme bootstrap must be present in the server response");
for (const [saved, systemDark, expected] of [
  [null, false, "light"],
  [null, true, "dark"],
  ["system", false, "light"],
  ["system", true, "dark"],
  ["light", true, "light"],
  ["dark", false, "dark"],
]) {
  const attributes = new Map();
  const style = {};
  runInNewContext(bootstrap, {
    document: {
      documentElement: {
        style,
        setAttribute: (key, value) => attributes.set(key, value),
      },
    },
    localStorage: { getItem: () => saved },
    window: { matchMedia: () => ({ matches: systemDark }) },
  });
  assert.equal(attributes.get("data-theme"), expected);
  assert.equal(style.colorScheme, expected);
}
for (const id of ["work", "about", "contact"]) {
  assert.match(html, new RegExp(`id="${id}"`), `Missing ${id} destination`);
  assert.match(html, new RegExp(`href="#${id}"`), `Missing ${id} navigation`);
}
for (const [host, image] of [
  ["statsconnect.app", "statsconnect"],
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
const css = await readFile(
  new URL("../src/styles/app.css", import.meta.url),
  "utf8",
);
for (const match of css.matchAll(/letter-spacing:\s*(-?[\d.]+)em/g)) {
  assert.ok(
    Number(match[1]) >= -0.03,
    "Display tracking must not be tighter than -0.03em",
  );
}
assert.doesNotMatch(source, /piggies/i);
await assert.rejects(
  access(new URL("../public/screenshots/piggies.png", import.meta.url)),
  "Removed project screenshot must not remain publicly served",
);
const removedAsset = await fetch(new URL("/screenshots/piggies.png", base));
assert.equal(removedAsset.status, 404, "Removed screenshot must return 404");
console.log(
  "Portfolio checks passed: SSR, navigation, contact, six previews, arrow restraint, and six theme initialization cases.",
);
