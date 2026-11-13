#!/usr/bin/env node
// Skill durum raporu: versiyon, eval sayisi, acik feedback, son egitim.
// Kullanim: node scripts/skills-report.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const skillsDir = path.join(root, ".claude/skills");
const fbDir = path.join(root, "vault/04-Skills/feedback");

const fm = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^\s*([\w-]+):\s*(.*?)\s*(#.*)?$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return out;
};

const feedback = fs.existsSync(fbDir)
  ? fs.readdirSync(fbDir).filter((f) => f.endsWith(".md")).map((f) => fm(fs.readFileSync(path.join(fbDir, f), "utf8")))
  : [];

const rows = [];
for (const name of fs.readdirSync(skillsDir).sort()) {
  const file = path.join(skillsDir, name, "SKILL.md");
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const meta = fm(text);
  const official = name.startsWith("remotion-");
  const evalsFile = path.join(skillsDir, name, "evals.md");
  const evals = fs.existsSync(evalsFile) ? (fs.readFileSync(evalsFile, "utf8").match(/^## E\d+/gm) || []).length : 0;
  const mine = feedback.filter((f) => f.skill === name);
  const open = mine.filter((f) => f.status === "açık");
  const high = open.filter((f) => f.severity === "yüksek" || f.type === "kullanıcı-düzeltmesi").length;
  const last = (text.match(/^- \d+\.\d+\.\d+ \((\d{4}-\d{2}-\d{2})\)/gm) || []).map((l) => l.match(/\((.*)\)/)[1]).sort().pop() || "-";
  rows.push({ skill: name, tür: official ? "resmi" : "bizim", versiyon: meta.version || "?", eval: official ? "-" : evals, açık: open.length, yüksek: high, "son değişim": official ? "-" : last });
}
console.table(rows);

const orphan = feedback.filter((f) => f.status === "açık" && (!f.skill || f.skill === "(yok)"));
if (orphan.length) console.log(`\nSkill'siz (skill-forge adayi) acik feedback: ${orphan.length}`);
const todo = rows.filter((r) => r.yüksek > 0 || r.açık >= 3).map((r) => r.skill);
console.log(todo.length ? `\nEgitim onerilen: ${todo.join(", ")}` : "\nEgitim gerektiren skill yok.");
