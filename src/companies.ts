/**
 * Loads the company dataset from the bundled CSV at data/companies.csv.
 *
 * The CSV is the canonical source of truth. We parse it once at module
 * import time and cache the result so consumers pay the cost only once.
 *
 * We deliberately avoid pulling in a CSV-parser dependency — the file is
 * well-formed and our parser handles the only quoting rule used (RFC 4180
 * double-quoted fields with escaped inner quotes).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { Company, ATSSystem, HiringVolumeTier } from "./types.js";

/**
 * Resolves the bundled CSV path whether running from src/, dist/, examples/,
 * or as a transitive dep deep inside another project's node_modules.
 *
 * We use require.resolve("../package.json") (works in CJS) or fall back to a
 * cwd-walk so this stays portable across both ESM and CJS without depending
 * on `import.meta.url` (which tsup can't polyfill for CJS).
 */
function resolveCsvPath(): string {
  const candidates: string[] = [];

  // 1) If we're running under CommonJS (or tsup's CJS shim), use require.resolve
  //    to find our own package.json — that's the most reliable anchor when
  //    consumed as a node_module.
  const req: NodeRequire | undefined =
    typeof require === "function" ? require : undefined;
  if (req) {
    try {
      const pkgPath = req.resolve("@withresumeai/ats-data/package.json");
      candidates.push(resolve(dirname(pkgPath), "data/companies.csv"));
    } catch {
      // Not installed under that name — we're running from source.
    }
  }

  // 2) Walk up from cwd. Handles `npm test`, `node examples/quickstart.mjs`,
  //    and consumers who haven't installed via npm yet.
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    candidates.push(resolve(dir, "data/companies.csv"));
    candidates.push(
      resolve(dir, "node_modules/@withresumeai/ats-data/data/companies.csv")
    );
    dir = resolve(dir, "..");
  }

  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      // try next
    }
  }
  throw new Error(
    "@withresumeai/ats-data: could not locate data/companies.csv on disk."
  );
}

/** Minimal RFC-4180 CSV row parser. */
function parseCsvRow(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur);
  return out;
}

function isTier(v: string): v is HiringVolumeTier {
  return v === "mega" || v === "high" || v === "mid";
}

let cached: Company[] | null = null;

/** Loads + parses the CSV once. */
export function loadCompanies(): Company[] {
  if (cached) return cached;

  const raw = readFileSync(resolveCsvPath(), "utf8");
  const lines = raw.split(/\r?\n/);

  // Skip leading "# ..." metadata comments + blank lines.
  let headerIdx = 0;
  while (
    headerIdx < lines.length &&
    (lines[headerIdx].startsWith("#") || lines[headerIdx].trim() === "")
  ) {
    headerIdx++;
  }

  const header = parseCsvRow(lines[headerIdx]);
  const col = (name: string) => header.indexOf(name);

  const iName = col("name");
  const iSlug = col("slug");
  const iIndustry = col("industry");
  const iAts = col("ats_system");
  const iTier = col("hiring_volume_tier");
  const iRoles = col("top_roles");
  const iSrc = col("source_url");

  const rows: Company[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.trim() === "") continue;
    const cells = parseCsvRow(line);
    if (cells.length < header.length) continue;

    const tier = cells[iTier];
    const rolesRaw = cells[iRoles];

    rows.push({
      name: cells[iName],
      slug: cells[iSlug],
      industry: cells[iIndustry],
      atsSystem: cells[iAts] as ATSSystem,
      hiringVolumeTier: isTier(tier) ? tier : undefined,
      topRoles: rolesRaw ? rolesRaw.split("|").filter(Boolean) : [],
      sourceUrl: cells[iSrc],
    });
  }

  cached = rows;
  return rows;
}
