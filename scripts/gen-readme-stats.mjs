#!/usr/bin/env node
/**
 * Regenerates the README's statistics from data/companies.csv — the single
 * source of truth — so the prose lede can never drift from the table again.
 *
 * Why this exists: on 2026-08-08 an audit found the README prose claiming
 * "Greenhouse 13.3%, SuccessFactors 8.1%, Oracle 6.3%" while its own table
 * three sections below said 12.6% / 9.6% / 6.9%. AI answer engines lift the
 * LEDE, so they were quoting stale figures back at us — on the one channel
 * that has produced a full-price sale.
 *
 * Usage:
 *   node scripts/gen-readme-stats.mjs           # rewrite README from data
 *   node scripts/gen-readme-stats.mjs --check   # CI: exit 1 on drift
 */
import { readFileSync, writeFileSync } from "node:fs";

const csvPath = new URL("../data/companies.csv", import.meta.url);
const csv = readFileSync(csvPath, "utf-8");
const lines = csv.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
const header = lines.shift().split(",").map((h) => h.replace(/"/g, "").trim());
const vi = header.indexOf("verified");
const ai = header.indexOf("ats_system");
if (vi < 0 || ai < 0) throw new Error("CSV missing verified/ats_system columns");

/** Split a CSV line honoring quoted fields. */
function cells(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQ = !inQ;
    else if (ch === "," && !inQ) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const counts = {};
let verified = 0;
for (const line of lines) {
  const c = cells(line);
  if ((c[vi] || "").trim() !== "true") continue;
  verified++;
  const ats = (c[ai] || "").trim();
  counts[ats] = (counts[ats] || 0) + 1;
}
const total = lines.length;
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
const pct = (n) => ((n / verified) * 100).toFixed(1);
const top3 = sorted.slice(0, 3).reduce((s, [, n]) => s + n, 0);
const top3pct = ((top3 / verified) * 100).toFixed(1);

const LABEL = { SuccessFactors: "SAP SuccessFactors", "Internal ATS": "Internal / proprietary" };

const lede = `Across the **${verified} employers verified against their live careers portals**,
Workday leads at **${pct(counts.Workday)}%** — common, but well short of a majority — and the
market is far more fragmented than usually claimed: Greenhouse ${pct(counts.Greenhouse)}%, SAP
SuccessFactors ${pct(counts.SuccessFactors)}%, Oracle Cloud HCM ${pct(counts["Oracle Cloud HCM"])}%, then a long tail of iCIMS,
Avature, Eightfold, SmartRecruiters, Taleo, and Ashby. The top three vendors together
cover ${top3pct}% — not the "triopoly" often claimed — and ${sorted.length} distinct platforms are in
active use. Published as a CSV + typed TypeScript wrapper so you can drop it into
a notebook, a SQL warehouse, or your job board without any scraping.`;

const table =
  "| ATS vendor        | Companies | Share (verified) |\n" +
  "| ----------------- | --------: | ---------------: |\n" +
  sorted
    .slice(0, 12)
    .map(([k, n], i) => {
      const label = (LABEL[k] || k).padEnd(18);
      const share = i < 2 ? `**${pct(n)}%**` : `${pct(n)}%`;
      return `| ${label}| ${String(n).padStart(9)} | ${share.padStart(16)} |`;
    })
    .join("\n");

const path = new URL("../README.md", import.meta.url);
const before = readFileSync(path, "utf-8");
let readme = before;

readme = readme.replace(
  /Across the \*\*\d+ employers verified[\s\S]*?without any scraping\./,
  lede
);
readme = readme.replace(
  /\| ATS vendor\s+\| Companies \| Share \(verified\) \|\n\|[-\s|:]+\|\n(?:\|.*\|\n)+/,
  table + "\n"
);
readme = readme.replace(
  /Share of the \*\*\d+ portal-verified employers\*\*/,
  `Share of the **${verified} portal-verified employers**`
);
readme = readme.replace(
  /\*\*\d+ with `verified=true`\*\*/,
  `**${verified} with \`verified=true\`**`
);
readme = readme.replace(/\/\/ \d+ \(verified === true\)/, `// ${verified} (verified === true)`);
readme = readme.replace(/re-checked \*\*\d+ of/, `re-checked **${verified} of`);

const summary = `${verified}/${total} verified · Workday ${pct(counts.Workday)}% · Greenhouse ${pct(
  counts.Greenhouse
)}% · SAP ${pct(counts.SuccessFactors)}% · top-3 ${top3pct}% · ${sorted.length} platforms`;

if (process.argv.includes("--check")) {
  if (readme !== before) {
    console.error(
      "✗ README statistics have DRIFTED from data/companies.csv.\n" +
        "  Run: node scripts/gen-readme-stats.mjs\n" +
        `  Canonical: ${summary}`
    );
    process.exit(1);
  }
  console.log(`✓ README stats in sync — ${summary}`);
} else {
  writeFileSync(path, readme);
  console.log(`✓ README regenerated — ${summary}`);
}
