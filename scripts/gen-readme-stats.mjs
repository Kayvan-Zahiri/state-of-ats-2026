#!/usr/bin/env node
// Generate the README's bounded snapshot summary from the bundled CSV.
import { readFileSync, writeFileSync } from "node:fs";

const csv = readFileSync(new URL("../data/companies.csv", import.meta.url), "utf8");
const lines = csv.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#"));

function cells(line) {
  const out = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && quoted && line[i + 1] === '"') {
      value += '"';
      i++;
    } else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) {
      out.push(value);
      value = "";
    } else value += char;
  }
  if (quoted) throw new Error("Unclosed CSV field in snapshot");
  out.push(value);
  return out;
}

const header = cells(lines.shift());
const indices = Object.fromEntries(
  ["verified", "ats_system", "apply_host", "checked_at"].map((column) => {
    const index = header.indexOf(column);
    if (index < 0) throw new Error(`CSV missing ${column}`);
    return [column, index];
  }),
);
const rows = lines.map((line) => {
  const row = cells(line);
  if (row.length !== header.length) throw new Error("CSV row does not match header");
  return row;
});
const verified = rows.filter((row) => row[indices.verified] === "true");
if (!verified.length) throw new Error("Snapshot has no verified rows to summarize");
const counts = new Map();
for (const row of verified) {
  const ats = row[indices.ats_system];
  counts.set(ats, (counts.get(ats) ?? 0) + 1);
}
const sorted = [...counts].sort((a, b) => b[1] - a[1]);
const withHost = rows.filter((row) => row[indices.apply_host]).length;
const dates = rows.map((row) => row[indices.checked_at]).filter(Boolean).sort();
const latest = dates.at(-1) ?? "not published";
const labels = { SuccessFactors: "SAP SuccessFactors", "Internal ATS": "Internal / proprietary" };
const table = sorted.slice(0, 12).map(([ats, count]) =>
  `| ${labels[ats] ?? ats} | ${count} | ${(count / verified.length * 100).toFixed(1)}% |`,
).join("\n");
const summary = `This snapshot contains **${rows.length} employers**, with **${verified.length} rows marked \`verified=true\`** and **${withHost} rows containing a recorded \`apply_host\`**. These are different measures. The latest nonempty per-row \`checked_at\` is **${latest}**; a package release does not re-verify the employers.

The table counts only rows marked \`verified=true\` in this selected snapshot. It is not an estimate of industry-wide market share or current employer configurations.

| ATS vendor | Records | Share of flagged subset |
| --- | ---: | ---: |
${table}`;

const path = new URL("../README.md", import.meta.url);
const before = readFileSync(path, "utf8");
const start = "<!-- dataset-stats:start -->";
const end = "<!-- dataset-stats:end -->";
if (before.split(start).length !== 2 || before.split(end).length !== 2 || before.indexOf(start) > before.indexOf(end)) {
  throw new Error("README must contain exactly one ordered dataset-stats block");
}
const after = before.slice(0, before.indexOf(start) + start.length)
  + `\n${summary}\n`
  + before.slice(before.indexOf(end));
if (process.argv.includes("--check")) {
  if (before !== after) {
    console.error("README snapshot statistics drifted. Run npm run stats.");
    process.exit(1);
  }
  console.log(`README snapshot statistics match ${rows.length} rows.`);
} else {
  writeFileSync(path, after);
  console.log(`Updated README snapshot statistics from ${rows.length} rows.`);
}
