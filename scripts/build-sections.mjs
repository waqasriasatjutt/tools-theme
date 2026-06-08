/**
 * build-sections — render each React section component to plain HTML and write
 * sections/<slug>.{html,css,json,js}, the artifacts the Websites Portal imports.
 *
 *     npm install            # first time only
 *     npm run build:sections
 *     git add -A && git commit -m "..." && git push
 *     # then in the portal: open the theme -> "Fetch from GitHub"
 *
 * A section file in components/sections/ should:
 *     export const meta = { name, slug, category, sequence, description }
 *     export default function MySection(props = {}) { return (<section> ... </section>); }
 * Optional siblings: <Name>.css (styles) and <Name>.js (a `(function(el){ ... })(root)`
 * script that runs on the live site after the section mounts — for interactive bits).
 * Output file names come from meta.slug (falling back to the lowercased file name),
 * so the portal section slugs match what you declare in the component.
 */
import esbuild from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, writeFileSync, copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const SRC = join(process.cwd(), "components", "sections");
const OUT = join(process.cwd(), "sections");
rmSync(OUT, { recursive: true, force: true });   // start clean so renamed/removed sections don't linger
mkdirSync(OUT, { recursive: true });

const jsxFiles = readdirSync(SRC).filter((f) => f.endsWith(".jsx"));
if (!jsxFiles.length) { console.error("No .jsx sections found in components/sections/"); process.exit(1); }

let n = 0;
for (const f of jsxFiles) {
  const base = f.replace(/\.jsx$/, "");
  const tmp = join(SRC, `.__build_${base}.mjs`);
  await esbuild.build({
    entryPoints: [join(SRC, f)],
    outfile: tmp,
    bundle: true, format: "esm", platform: "node",
    jsx: "automatic", jsxImportSource: "react",
    external: ["react", "react-dom", "react-dom/server", "react/jsx-runtime", "react/jsx-dev-runtime"],
    loader: { ".css": "empty" },                 // components shouldn't import CSS, but be safe
    logLevel: "silent",
  });
  let mod;
  try { mod = await import(`${pathToFileURL(tmp).href}?t=${Date.now()}`); }
  finally { try { rmSync(tmp); } catch {} }

  const Comp = mod.default;
  if (typeof Comp !== "function") { console.warn(`skip ${f}: no default-exported component`); continue; }
  const meta = mod.meta || {};
  const slug = (meta.slug || base.toLowerCase()).trim();

  writeFileSync(join(OUT, `${slug}.html`), renderToStaticMarkup(React.createElement(Comp)) + "\n");

  const cssSrc = join(SRC, `${base}.css`);
  const hasCss = existsSync(cssSrc);
  if (hasCss) copyFileSync(cssSrc, join(OUT, `${slug}.css`));

  const jsSrc = join(SRC, `${base}.js`);
  const hasJs = existsSync(jsSrc);
  if (hasJs) copyFileSync(jsSrc, join(OUT, `${slug}.js`));

  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify({
    name: meta.name || base,
    slug,
    category: meta.category || "Sections",
    sequence: meta.sequence ?? 10,
    description: meta.description || "",
  }, null, 2) + "\n");

  n++;
  console.log(`built  sections/${slug}.html  +json` + (hasCss ? "  +css" : "") + (hasJs ? "  +js" : "") + `   (${base}.jsx)`);
}
console.log(`\nDone — ${n} section(s). Commit & push, then re-fetch the theme in the portal.`);
