#!/usr/bin/env node
// Vault saglik kontrolu: kirik [[wikilink]]'ler ve hicbir yerden link almayan (yetim) notlar.
// Kullanim: node scripts/vault-check.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../vault");
const skip = new Set([".obsidian", "_Templates", "_attachments", ".trash"]);

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md")) files.push(p);
  }
})(root);

const names = new Map(files.map((f) => [path.basename(f, ".md").toLowerCase(), f]));
const inbound = new Map(files.map((f) => [f, 0]));
const broken = [];

for (const f of files) {
  const text = fs.readFileSync(f, "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  for (const m of text.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
    const target = path.basename(m[1].trim()).toLowerCase();
    const hit = names.get(target);
    if (hit) { if (hit !== f) inbound.set(hit, inbound.get(hit) + 1); }
    else broken.push(`${path.relative(root, f)} -> [[${m[1]}]]`);
  }
}

const exempt = (f) => /Home\.md$|README\.md$|04-Skills\/feedback\//.test(f);
const orphans = files.filter((f) => inbound.get(f) === 0 && !exempt(f)).map((f) => path.relative(root, f));

console.log(`Notlar: ${files.length}`);
console.log(broken.length ? `\nKirik linkler (${broken.length}):\n  ` + broken.join("\n  ") : "\nKirik link yok.");
console.log(orphans.length ? `\nYetim notlar (${orphans.length}):\n  ` + orphans.join("\n  ") : "\nYetim not yok.");
process.exitCode = broken.length ? 1 : 0;
