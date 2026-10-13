// Static checks for the no-build app. Run: node scripts/check.mjs
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

// All app files live in public/; paths below are relative to it.
process.chdir(fileURLToPath(new URL("../public/", import.meta.url)));

const errors = [];
const read = (file) => readFileSync(file, "utf8");
const fail = (message) => errors.push(message);

// Syntax
for (const file of ["logic.js", "app.js", "sw.js", "privacy.js"]) {
  try {
    new vm.Script(read(file), { filename: file });
  } catch (error) {
    fail(`${file}: ${error.message}`);
  }
}
try {
  JSON.parse(read("manifest.webmanifest"));
} catch (error) {
  fail(`manifest.webmanifest: ${error.message}`);
}

// Translation tables: same keys in EN and PL, and every key used in the HTML exists.
const app = read("app.js");
const start = app.indexOf("const translations = ");
const end = app.indexOf("\nconst state = ", start);
const translations = vm.runInNewContext(`(${app.slice(start + "const translations = ".length, end).trim().replace(/;$/, "")})`);
const en = new Set(Object.keys(translations.en));
const pl = new Set(Object.keys(translations.pl));
for (const key of en) if (!pl.has(key)) fail(`translation "${key}" missing in pl`);
for (const key of pl) if (!en.has(key)) fail(`translation "${key}" missing in en`);

const html = read("index.html");
for (const [, key] of html.matchAll(/data-i18n(?:-placeholder|-aria|-alt)?="([^"]+)"/g)) {
  if (!en.has(key)) fail(`index.html uses unknown translation key "${key}"`);
}

// Every service-worker shell entry and manifest icon must exist.
const shell = [...read("sw.js").matchAll(/^\s+"([^"]+)",?$/gm)].map((m) => m[1]).filter((p) => p !== "./");
const icons = JSON.parse(read("manifest.webmanifest")).icons.map((icon) => icon.src);
for (const file of shell.filter((entry) => entry.endsWith(".html"))) {
  fail(`sw.js SHELL lists ${file}: use the URL without .html ("./" for index.html)`);
}
for (const file of new Set([...shell, ...icons])) {
  // The host serves privacy.html at /privacy, and the shell lists the served URL.
  if (!existsSync(file) && !existsSync(`${file}.html`)) fail(`missing file: ${file}`);
}

// The footer version (APP_VERSION) and the service-worker cache name move together.
const version = app.match(/^const APP_VERSION = "([^"]+)";$/m)?.[1];
const cache = read("sw.js").match(/^const CACHE = "([^"]+)";$/m)?.[1];
if (!version || cache !== `tearsheet-v${version}`) {
  fail(`sw.js CACHE "${cache}" does not match APP_VERSION "${version}" (expected "tearsheet-v${version}")`);
}

// The Content-Security-Policy allows no inline scripts.
for (const file of ["index.html", "privacy.html"]) {
  if (/<script(?![^>]*\ssrc=)[^>]*>/i.test(read(file))) fail(`${file}: inline <script> is blocked by the CSP`);
}

if (errors.length) {
  console.error(errors.map((e) => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`ok: ${en.size} translation keys, ${shell.length} cached files`);
